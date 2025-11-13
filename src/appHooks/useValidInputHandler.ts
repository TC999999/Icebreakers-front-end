import { useState, useCallback, useEffect } from "react";
import type { validityTypes, validity } from "../types/errorsTypes";
import {
  inputValidityHandler,
  submitErrorHandler,
} from "../errorHandlers/validityHandler";
import { constructErrorMap } from "../helpers/constructErrorMap";
import type { FormData } from "../types/miscTypes";

const useValidInputHandler = (inputs: FormData = {}) => {
  const [validInputs, setValidInputs] = useState<validityTypes>({});
  const [currentErrorFlash, setCurrentErrorFlash] = useState<validity>({});

  const [initialErrorFlash, setInitialErrorFlash] = useState<validity>({});
  const [showDirections, setShowDirections] = useState<string>("");

  const setValidValues = useCallback((inputs: FormData) => {
    let { ErrorMap, ErrorFlash } = constructErrorMap(inputs);
    setValidInputs(ErrorMap);
    setCurrentErrorFlash(ErrorFlash);
    setInitialErrorFlash(ErrorFlash);
  }, []);

  // handles validity on initial render if input value is passed in
  useEffect(() => {
    setValidValues(inputs);
  }, [inputs]);

  const handleInputValidity = useCallback(
    (name: string, value: string | number[]) => {
      inputValidityHandler({ name, value, setter: setValidInputs });
    },
    [validInputs]
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

  const handleSubmitValidity = useCallback(() => {
    return submitErrorHandler(validInputs, setCurrentErrorFlash);
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
    setValidValues,
  };
};

export default useValidInputHandler;
