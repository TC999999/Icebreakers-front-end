import { useState, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type Register } from "../../types/authTypes";
import { RegisterUser } from "../../features/actions/auth";
import { type AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";

const useSignUp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const initialState: Register = {
    username: "",
    password: "",
    emailAddress: "",
    favoriteColor: "#000000",
    biography: "",
  };

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

  return { formData, handleChange, handleSubmit };
};
export default useSignUp;
