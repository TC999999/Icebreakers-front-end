import { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import { shallowEqual } from "react-redux";
import type { newGroup } from "../../types/groupTypes";
import interestsAPI from "../../apis/interestsAPI";
import type { interestMap } from "../../types/interestTypes";

const useCreateGroupForm = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );

  const initialData: newGroup = {
    title: "",
    host: username!,
    description: "",
    interests: {},
  };

  const [formData, setFormData] = useState<newGroup>(initialData);
  const interestsList = useRef<interestMap>({});

  useEffect(() => {
    const getInterests = async () => {
      const interests = await interestsAPI.getInterestsMap();
      interestsList.current = interests;
      console.log(Object.values(interests));
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
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData);
    },
    [formData]
  );

  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          interests: {
            ...prev.interests,
            [value]: interestsList.current[value],
          },
        }));
      }
    },
    [formData]
  );

  return {
    formData,
    interestsList,
    handleChange,
    handleCheckBox,
    handleSubmit,
  };
};

export default useCreateGroupForm;
