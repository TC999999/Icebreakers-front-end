import { useState, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type LogIn } from "../../types/authTypes";
import { LogInUser } from "../../features/actions/auth";
import { type AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";

const useLogIn = () => {
  const initialState: LogIn = { username: "", password: "" };
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [formData, setFormData] = useState<LogIn>(initialState);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        console.log(formData);
        await dispatch(LogInUser(formData));
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    },
    [formData]
  );

  return { formData, handleChange, handleSubmit };
};

export default useLogIn;
