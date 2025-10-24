import { useState, useEffect, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import type { newGroup } from "../../types/groupTypes";
import interestsAPI from "../../apis/interestsAPI";
import type { interestMap } from "../../types/interestTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import { setFormLoading } from "../../features/slices/auth";

const useCreateGroupForm = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );

  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const initialData: newGroup = {
    title: "",
    host: username!,
    description: "",
    interests: {},
  };

  const [formData, setFormData] = useState<newGroup>(initialData);
  const [interestList, setInterestList] = useState<interestMap>({});

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
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        dispatch(setFormLoading(true));
        await groupConversationsAPI.createConversation(formData);
        navigate("/groups");
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
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          interests: {
            ...prev.interests,
            [value]: interestList[value],
          },
        }));
      } else {
        let newInterestList = { ...formData.interests };
        delete newInterestList[value];
        setFormData((prev) => ({ ...prev, interests: newInterestList }));
      }
    },
    [formData]
  );

  return {
    formData,
    interestList,
    handleChange,
    handleCheckBox,
    handleSubmit,
  };
};

export default useCreateGroupForm;
