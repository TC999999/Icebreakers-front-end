import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import type { newGroup } from "../../types/groupTypes";
import interestsAPI from "../../apis/interestsAPI";
import type { interestMap } from "../../types/interestTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import { setFormLoading } from "../../features/slices/auth";
import useValidInputHandler from "../../appHooks/useValidInputHandler";

const useCreateGroupForm = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );

  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const initialData: newGroup = {
    title: "",
    description: "",
    interests: [],
  };

  const [formData, setFormData] = useState<newGroup>(initialData);
  const [interestList, setInterestList] = useState<interestMap>({});

  const originalData = useRef<newGroup>(initialData);

  const {
    validInputs,
    showDirections,
    currentErrorFlash,
    handleInputValidity,
    handleSubmitValidity,
    handleMouseEnter,
    handleMouseExit,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  useEffect(() => {
    const getInterests = async () => {
      const interests = await interestsAPI.getInterestsMap();
      setInterestList(interests);
    };
    getInterests();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          dispatch(setFormLoading(true));
          if (username)
            await groupConversationsAPI.createConversation(username, formData);
          navigate("/groups");
        } else {
          handleClientFlashError();
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [formData, dispatch]
  );

  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;

      let newInterests = [...formData.interests];
      if (checked) {
        newInterests.push(parseFloat(value));
      } else {
        newInterests = newInterests.filter((i) => {
          return i !== parseFloat(value);
        });
      }
      handleInputValidity("interests", newInterests);

      setFormData((prev) => ({ ...prev, interests: newInterests }));
    },
    [formData]
  );

  return {
    formData,
    interestList,
    validInputs,
    showDirections,
    currentErrorFlash,
    handleChange,
    handleCheckBox,
    handleSubmit,
    handleMouseEnter,
    handleMouseExit,
  };
};

export default useCreateGroupForm;
