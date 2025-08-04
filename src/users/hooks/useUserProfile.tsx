import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";

import userAPI from "../../apis/userAPI";

const useUserProfile = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { username } = useParams();
  const [userState, setUserState] = useState();

  useEffect((): void => {
    const getUserProfile = async () => {
      dispatch(setFormLoading(true));
      try {
        if (username) {
          let user = await userAPI.getUserProfile(username);
          console.log(user);
          setUserState(user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };
    getUserProfile();
  }, []);

  return { userState };
};

export default useUserProfile;
