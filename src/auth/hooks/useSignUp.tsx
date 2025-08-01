import { useState, useEffect, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type Register } from "../../types/authTypes";
import { type interests } from "../../types/interestTypes";
import { RegisterUser } from "../../features/actions/auth";
import { type AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";
import interestsAPI from "../../apis/interestsAPI";

const useSignUp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const initialState: Register = {
    username: "",
    password: "",
    emailAddress: "",
    favoriteColor: "#000000",
    biography: "",
    interests: [],
  };
  const [initialInterests, setInitialInterests] = useState<interests>([]);

  useEffect(() => {
    const getInitialInterests = async () => {
      try {
        let initialInterests = await interestsAPI.getInterests();
        setInitialInterests(initialInterests);
      } catch (err) {
        console.log(err);
      }
    };

    getInitialInterests();
  }, []);

  const [formData, setFormData] = useState<Register>(initialState);

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
      const { name, value } = e.target;
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [formData]
  );

  const handleCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, checked } = e.target;
      let newInterests = formData.interests;

      if (checked) {
        newInterests.push(+value);
      } else {
        newInterests = newInterests.filter((i) => {
          return i !== +value;
        });
      }
      setFormData((d) => ({ ...d, interests: newInterests }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        await dispatch(RegisterUser(formData)).unwrap();
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    },
    [formData]
  );

  return {
    formData,
    initialInterests,
    handleChange,
    handleCheckbox,
    handleSubmit,
  };
};
export default useSignUp;
