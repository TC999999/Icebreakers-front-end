import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type Register } from "../../types/authTypes";
import { type interests } from "../../types/interestTypes";
import { RegisterUser } from "../../features/actions/auth";
import { type AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";
import interestsAPI from "../../apis/interestsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";

const useSignUp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const initialState = useRef<Register>({
    username: "",
    password: "",
    emailAddress: "",
    biography: "",
    favoriteColor: "#ffffff",
    interests: [],
  });

  const [formData, setFormData] = useState<Register>(initialState.current);

  const {
    validInputs,
    currentErrorFlash,
    showDirections,
    handleMouseEnter,
    handleMouseExit,
    handleInputValidity,
    handleClientFlashError,
    handleServerFlashError,
    handleSubmitValidity,
  } = useValidInputHandler(initialState.current);

  const [initialInterests, setInitialInterests] = useState<interests>([]);
  const [serverError, setServerError] = useState<string>("");

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

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setFormData((data) => ({ ...data, [name]: value }));
      if (serverError) setServerError("");
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

      handleInputValidity("interests", newInterests);
      setFormData((d) => ({ ...d, interests: newInterests }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          await dispatch(RegisterUser(formData)).unwrap();
          navigate("/");
        } else {
          handleClientFlashError();
        }
      } catch (err) {
        if (typeof err === "string") setServerError(err);

        if (err === "Username already taken!") {
          handleServerFlashError("username");
        } else if (err === "Email Address already taken!") {
          handleServerFlashError("emailAddress");
        }
      }
    },
    [formData, validInputs]
  );

  return {
    formData,
    initialInterests,
    showDirections,
    validInputs,
    currentErrorFlash,
    serverError,
    handleChange,
    handleCheckbox,
    handleMouseEnter,
    handleMouseExit,
    handleSubmit,
  };
};
export default useSignUp;
