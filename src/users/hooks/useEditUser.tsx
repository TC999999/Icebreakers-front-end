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

const useEditUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialData: UserEdit = {
    emailAddress: "",
    biography: "",
    favoriteColor: "#000000",
    interests: [],
  };

  const [userData, setUserData] = useState<UserEdit>(initialData);
  const interestsList = useRef<interestMap>({});
  const originalData = useRef<UserEdit>(initialData);

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
    setValidValues,
  } = useValidInputHandler(originalData.current);

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleInputValidity(name, value);
      setUserData((prev) => ({ ...prev, [name]: value }));
    },
    [userData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleSubmitValidity()) {
          // console.log("NO ERRORS HERE");
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
          // console.log("ERRORS ABOUND");
          handleClientFlashError();
        }
      } catch (err) {
        if (err === "Email Address already taken!") {
          handleServerFlashError("emailAddress");
        }
      }
    },
    [userData]
  );

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setUserData(originalData.current);
      setValidValues(originalData.current);
    },
    [userData]
  );

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
    handleMouseEnter,
    handleMouseExit,
  };
};

export default useEditUser;
