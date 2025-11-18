import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { UserEdit } from "../../types/userTypes";
import type { interestMap } from "../../types/interestTypes";
import { useAppDispatch } from "../../features/hooks";
import {
  setFormLoading,
  setLoadError,
  setFavoriteColor,
} from "../../features/slices/auth";
import userAPI from "../../apis/userAPI";
import socket from "../../helpers/socket";
import useValidInputHandler from "../../appHooks/useValidInputHandler";

// custom hook for form to update user information
const useEditUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const originalData = useRef<UserEdit>({
    emailAddress: "",
    biography: "",
    favoriteColor: "#000000",
    interests: [],
  });

  const [userData, setUserData] = useState<UserEdit>(originalData.current);
  const interestsList = useRef<interestMap>({});

  // reusable custom validator hook for setting and checking input value validity
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
    setValidValues,
  } = useValidInputHandler(originalData.current);

  // on initial render, retrieves data that needs to be updated and sets them in state, if user
  // inserts a username that is not their own, throws and error and redirects user to error page
  useEffect(() => {
    const getUserForEdit = async () => {
      try {
        dispatch(setFormLoading(true));
        if (username) {
          const { user, interests } = await userAPI.getUserForEdit(username);
          setUserData(user);
          interestsList.current = interests;
          originalData.current = user;
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getUserForEdit();
  }, [dispatch]);

  // updates form data state and input value validity state when user changes a text or textarea
  // input value
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setUserData((prev) => ({ ...prev, [name]: value }));
    },
    [userData]
  );

  // submits data to backend if all inputs are valid, and returns new data to be updated in both
  // the frontend redux state and the backend express session
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          if (username) {
            const { newFavoriteColor } = await userAPI.editUser(
              username,
              userData
            );
            dispatch(setFavoriteColor(newFavoriteColor));
            socket.emit("updateFavoriteColor", {
              favoriteColor: newFavoriteColor,
            });
            navigate(`/user/${username}`);
          }
        } else {
          handleClientFlashError();
        }
      } catch (err) {
        if (err === "Email Address already taken!") {
          handleServerFlashError("emailAddress");
        }
      }
    },
    [userData, validInputs]
  );

  // resets all data back to their original state
  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setUserData(originalData.current);
      setValidValues(originalData.current);
    },
    [userData]
  );

  // updates form data state and input value validity state when user checks or unchecks a checkbox
  // input value
  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;

      let newInterests = [...userData.interests];
      if (checked) {
        newInterests.push(parseFloat(value));
      } else {
        newInterests = newInterests.filter((i) => {
          return i !== parseFloat(value);
        });
      }
      handleInputValidity("interests", newInterests);

      setUserData((prev) => ({
        ...prev,
        interests: newInterests,
      }));
    },
    [userData]
  );

  // returns a boolean if the interests id is found in the form data interest value array
  const checkUserInterests = useCallback(
    (id: number): boolean => {
      return userData.interests.includes(id);
    },
    [userData]
  );

  return {
    userData,
    interestsList,
    validInputs,
    showDirections,
    currentErrorFlash,
    checkUserInterests,
    handleChange,
    handleSubmit,
    handleReset,
    handleCheckBox,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
  };
};

export default useEditUser;
