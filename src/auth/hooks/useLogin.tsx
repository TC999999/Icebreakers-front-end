import { useState, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type LogIn } from "../../types/authTypes";
import { LogInUser } from "../../features/actions/auth";
import { type AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";

// hook for login page
const useLogIn = () => {
  const initialState: LogIn = { username: "", password: "" };
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  // initial form data set as empty username and password
  const [formData, setFormData] = useState<LogIn>(initialState);
  // server side error message
  const [error, setError] = useState<string>("");

  // updates form data when login input value changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [formData]
  );

  // handles submission for form data to backend; retrieves user data and sets redux user state
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        await dispatch(LogInUser(formData)).unwrap();
        navigate("/");
      } catch (err) {
        console.log(err);
        if (typeof err === "string") {
          setError(err);
        }
      }
    },
    [formData]
  );

  return { formData, error, handleChange, handleSubmit };
};

export default useLogIn;
