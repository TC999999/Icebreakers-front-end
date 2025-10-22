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

const useEditUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialData: UserEdit = {
    username: "",
    emailAddress: "",
    biography: "",
    favoriteColor: "#000000",
    interests: {},
  };

  const [userData, setUserData] = useState<UserEdit>(initialData);
  const interestsList = useRef<interestMap>({});
  const originalData = useRef<UserEdit>(initialData);

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
      setUserData((prev) => ({ ...prev, [name]: value }));
    },
    [userData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { newFavoriteColor } = await userAPI.editUser(userData);
      dispatch(setFavoriteColor(newFavoriteColor));
      navigate(`/user/${username}`);
    },
    [userData]
  );

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setUserData(originalData.current);
    },
    [userData]
  );

  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      if (checked) {
        setUserData((prev) => ({
          ...prev,
          interests: {
            ...prev.interests,
            [value]: {
              id: parseFloat(value),
              topic: interestsList.current[value].topic,
            },
          },
        }));
      } else {
        const newInterests = { ...userData.interests };
        delete newInterests[value];

        setUserData((prev) => ({
          ...prev,
          interests: newInterests,
        }));
      }
    },
    [userData]
  );

  const checkUserInterests = useCallback(
    (id: number): boolean => {
      return userData.interests.hasOwnProperty(id.toString());
    },
    [userData]
  );

  return {
    userData,
    interestsList,
    checkUserInterests,
    handleChange,
    handleSubmit,
    handleReset,
    handleCheckBox,
  };
};

export default useEditUser;
