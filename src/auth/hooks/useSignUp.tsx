import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type Register } from "../../types/authTypes";
import { type interests } from "../../types/interestTypes";
import { RegisterUser } from "../../features/actions/auth";
import { type AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";
import interestsAPI from "../../apis/interestsAPI";
import type {
  registerErrorFlash,
  registerValidityTypes,
} from "../../types/errorsTypes";
import {
  registerValidityHandler,
  submitRegisterErrorHandler,
} from "../../errorHandlers/auth/registerErrorHandler";

const useSignUp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const initialState: Register = {
    username: "",
    password: "",
    emailAddress: "",
    biography: "",
    favoriteColor: "#ffffff",
    interests: [],
  };

  const initialValidity: registerValidityTypes = {
    username: { lengthValid: false, characterValid: false },
    password: { lengthValid: false, characterValid: false },
    emailAddress: { addressValid: false },
    biography: { lengthValid: false, characterValid: false },
    interests: { lengthValid: false },
  };

  const initialErrorFlash: registerErrorFlash = {
    username: false,
    password: false,
    emailAddress: false,
    biography: false,
    interests: false,
  };

  const [initialInterests, setInitialInterests] = useState<interests>([]);
  const [validInputs, setValidInputs] =
    useState<registerValidityTypes>(initialValidity);
  const [currentRegisterErrorFlash, setCurrentRegisterErrorFlash] =
    useState<registerErrorFlash>(initialErrorFlash);

  const [showDirections, setShowDirections] = useState<string>("");
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

  const [formData, setFormData] = useState<Register>(initialState);

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
      const { name, value } = e.target;
      registerValidityHandler({ name, value, setter: setValidInputs });
      setFormData((data) => ({ ...data, [name]: value }));
      if (serverError) setServerError("");
    },
    [formData]
  );

  const handleMouseEnter = useCallback(
    (
      e:
        | React.MouseEvent<HTMLInputElement>
        | React.MouseEvent<HTMLTextAreaElement>
        | React.MouseEvent<HTMLDivElement>
    ) => {
      setShowDirections(e.currentTarget.id);
    },
    []
  );

  const handleMouseExit = useCallback(
    (
      e:
        | React.MouseEvent<HTMLInputElement>
        | React.MouseEvent<HTMLTextAreaElement>
        | React.MouseEvent<HTMLDivElement>
    ) => {
      e.preventDefault();
      setShowDirections("");
    },
    []
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

      registerValidityHandler({
        name: "interests",
        value: newInterests,
        setter: setValidInputs,
      });

      setFormData((d) => ({ ...d, interests: newInterests }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (
          submitRegisterErrorHandler(validInputs, setCurrentRegisterErrorFlash)
        ) {
          await dispatch(RegisterUser(formData)).unwrap();
          navigate("/");
        } else {
          setTimeout(() => {
            setCurrentRegisterErrorFlash(initialErrorFlash);
          }, 500);
        }
      } catch (err) {
        if (typeof err === "string") setServerError(err);

        if (err === "Username already taken!") {
          setCurrentRegisterErrorFlash((prev) => ({ ...prev, username: true }));
          setTimeout(() => {
            setCurrentRegisterErrorFlash(initialErrorFlash);
          }, 500);
        } else if (err === "Email Address already taken!") {
          setCurrentRegisterErrorFlash((prev) => ({
            ...prev,
            emailAddress: true,
          }));
          setTimeout(() => {
            setCurrentRegisterErrorFlash(initialErrorFlash);
          }, 500);
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
    currentRegisterErrorFlash,
    serverError,
    handleChange,
    handleCheckbox,
    handleMouseEnter,
    handleMouseExit,
    handleSubmit,
  };
};
export default useSignUp;
