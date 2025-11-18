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

// hook for page with form to create a new group
const useCreateGroupForm = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );

  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const originalData = useRef<newGroup>({
    title: "",
    description: "",
    interests: [],
  });

  const [formData, setFormData] = useState<newGroup>(originalData.current);
  const [interestList, setInterestList] = useState<interestMap>({});

  // reusable hook for setting and checking input validity
  const {
    validInputs,
    showDirections,
    currentErrorFlash,
    handleInputValidity,
    handleSubmitValidity,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
    handleClientFlashError,
  } = useValidInputHandler(originalData.current);

  // on initial render, returns and sets a list of all current interests for checklist
  useEffect(() => {
    const getInterests = async () => {
      const interests = await interestsAPI.getInterestsMap();
      setInterestList(interests);
    };
    getInterests();
  }, []);

  // updates form data state and input value validity state when input value changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  // updates form data state and input value validity state when check box is checked/unchecked
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

  // if all form inputs are valid, submits data to backend to create a new group conversation,
  // otherwise causes inputs with invalid values to flash red for 0.5 seconds
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
    [formData, validInputs, dispatch]
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
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
  };
};

export default useCreateGroupForm;
