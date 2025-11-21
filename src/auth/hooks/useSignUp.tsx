import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import type { Register } from "../../types/authTypes";
import type { interests } from "../../types/interestTypes";
import { RegisterUser } from "../../features/actions/auth";
import type { AppDispatch } from "../../features/store";
import { useAppDispatch } from "../../features/hooks";
import interestsAPI from "../../apis/interestsAPI";
import useValidInputHandler from "../../appHooks/useValidInputHandler";
import { toast } from "react-toastify";

// hook for signup page
const useSignUp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (message: string) => toast.error(message);

  const initialState = useRef<Register>({
    username: "",
    password: "",
    emailAddress: "",
    biography: "",
    favoriteColor: "#ffffff",
    interests: [],
  });

  // sets initial state for form data
  const [formData, setFormData] = useState<Register>(initialState.current);

  // custom hook data and functions for input value validity
  const {
    validInputs,
    currentErrorFlash,
    showDirections,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
    handleInputValidity,
    handleClientFlashError,
    handleServerFlashError,
    handleSubmitValidity,
  } = useValidInputHandler(initialState.current);

  // initial state for list of all interests
  const [initialInterests, setInitialInterests] = useState<interests>([]);

  // initial state for server side error message
  const [serverError, setServerError] = useState<string>("");

  // on initial render, gets initial list of interests
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

  // updates form data state on input value change, also updates value validity state based on
  // name of target, also clears server error message if one is present
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

  // updates interests value in form data state when an interest checkbox is checked or unchecked,
  // also updates interests validity state
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

  // if all input values pass validity test, submits user data to create an account and sets it
  // in the global redux user state; if not all values pass, flashes which inputs are invalid; if
  // error is server side, notifies user what the error is
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
        if (typeof err === "string") {
          setServerError(err);
          notify(err);
        }

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
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
    handleSubmit,
  };
};
export default useSignUp;
