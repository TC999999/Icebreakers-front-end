import { useState, useCallback } from "react";
import type {
  registerErrorFlash,
  registerValidityTypes,
} from "../types/errorsTypes";
import {
  registerValidityHandler,
  submitRegisterErrorHandler,
} from "../errorHandlers/auth/registerErrorHandler";

const useValidInputHandler = () => {
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

  const [validInputs, setValidInputs] =
    useState<registerValidityTypes>(initialValidity);
  const [currentErrorFlash, setCurrentErrorFlash] =
    useState<registerErrorFlash>(initialErrorFlash);
  const [showDirections, setShowDirections] = useState<string>("");

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

  const handleInputValidity = useCallback(
    (name: string, value: string | number[]) => {
      registerValidityHandler({ name, value, setter: setValidInputs });
    },
    [validInputs]
  );

  const handleSubmitValidity = useCallback(() => {
    return submitRegisterErrorHandler(validInputs, setCurrentErrorFlash);
  }, [validInputs]);

  const handleClientFlashError = useCallback(() => {
    setTimeout(() => {
      setCurrentErrorFlash(initialErrorFlash);
    }, 500);
  }, []);

  const handleServerFlashError = useCallback((name: string) => {
    setCurrentErrorFlash((prev) => ({ ...prev, [name]: true }));
    setTimeout(() => {
      setCurrentErrorFlash(initialErrorFlash);
    }, 500);
  }, []);

  return {
    validInputs,
    currentErrorFlash,
    showDirections,
    handleMouseEnter,
    handleMouseExit,
    handleInputValidity,
    handleSubmitValidity,
    handleClientFlashError,
    handleServerFlashError,
  };
};

export default useValidInputHandler;
