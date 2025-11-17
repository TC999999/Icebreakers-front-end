import { useState, useCallback, useEffect } from "react";
import type { validityTypes, validity } from "../types/errorsTypes";
import {
  inputValidityHandler,
  submitErrorHandler,
} from "../errorHandlers/validityHandler";
import { constructErrorMap } from "../helpers/constructErrorMap";
import type { FormData } from "../types/miscTypes";

// universal hook for forms to show requirements for field inputs and validating those inputs before
// submitting them to the backend server
const useValidInputHandler = (inputs: FormData = {}) => {
  // sets initial state as empty map for form input keys and validation requirement values
  const [validInputs, setValidInputs] = useState<validityTypes>({});
  // sets initial state as empty map for form input keys and boolean values: if any boolean is true,
  // flashes invalid fields
  const [currentErrorFlash, setCurrentErrorFlash] = useState<validity>({});
  // sets initial state as empty map for form input keys and boolean values
  const [initialErrorFlash, setInitialErrorFlash] = useState<validity>({});

  // state for which input field directions should be shown to user
  const [showDirections, setShowDirections] = useState<string>("");

  // callback function for initially setting valid input map based on input fields for the respective
  // form whose inputs are passed down in props
  const setValidValues = useCallback((inputs: FormData) => {
    let { ErrorMap, ErrorFlash } = constructErrorMap(inputs);
    setValidInputs(ErrorMap);
    setCurrentErrorFlash(ErrorFlash);
    setInitialErrorFlash(ErrorFlash);
  }, []);

  // handles validity and error flash maps on initial render for input value passed down in props
  useEffect(() => {
    setValidValues(inputs);
  }, [inputs]);

  // updates validInputs state when respective form value is updated
  const handleInputValidity = useCallback(
    (name: string, value: string | number[]) => {
      inputValidityHandler({ name, value, setter: setValidInputs });
    },
    [validInputs]
  );

  // sets which input directions should be shown when user focuses their cursor on field input
  const handleDirectionsFocus = useCallback(
    (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>
        | React.FocusEvent<HTMLDivElement>
    ) => {
      setShowDirections(e.currentTarget.id);
    },
    []
  );

  // sets which input directions should be shown when user hovers their cursor on field input
  const handleDirectionsEnter = useCallback(
    (
      e:
        | React.MouseEvent<HTMLInputElement>
        | React.MouseEvent<HTMLTextAreaElement>
        | React.MouseEvent<HTMLDivElement>
    ) => {
      e.preventDefault();
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        document.activeElement.blur();
      setShowDirections(e.currentTarget.id);
    },
    [showDirections]
  );

  // resets input directions to blank when user blurs their cursor out of field input
  const handleDirectionsBlur = useCallback(
    (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>
        | React.FocusEvent<HTMLDivElement>
    ) => {
      e.preventDefault();
      setShowDirections("");
    },
    []
  );

  // sets which input directions should be shown when user hovers their cursor on field input
  const handleDirectionsExit = useCallback(
    (
      e:
        | React.MouseEvent<HTMLInputElement>
        | React.MouseEvent<HTMLTextAreaElement>
        | React.MouseEvent<HTMLDivElement>
    ) => {
      e.preventDefault();
      setShowDirections("");
    },
    [showDirections]
  );

  // returns boolean that tells if all inputs are valid (true if they are, false if they don't),
  // causes fields with invalid inputs to flash red
  const handleSubmitValidity = useCallback(() => {
    return submitErrorHandler(validInputs, setCurrentErrorFlash);
  }, [validInputs]);

  // causes fields with invalid inputs that are flashing red to stop flashing if there is a
  // client side error
  const handleClientFlashError = useCallback(() => {
    setTimeout(() => {
      setCurrentErrorFlash(initialErrorFlash);
    }, 500);
  }, []);

  // causes fields with invalid inputs to flash red for half a second if error comes from
  // server side
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
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
    handleInputValidity,
    handleSubmitValidity,
    handleClientFlashError,
    handleServerFlashError,
    setValidValues,
  };
};

export default useValidInputHandler;
