import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { setFormLoading, setLoadError } from "../../features/slices/auth";
import { type UserProfile } from "../../types/userTypes";
import userAPI from "../../apis/userAPI";
import { DateTime } from "luxon";

const useUserProfile = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { username } = useParams();
  const [userState, setUserState] = useState<UserProfile>({
    username: "",
    biography: "",
    interests: [],
    favoriteColor: "#ffffff",
    createdAt: "",
  });

  useEffect((): void => {
    const getUserProfile = async () => {
      dispatch(setFormLoading(true));
      try {
        if (username) {
          let user = await userAPI.getUserProfile(username);
          let newDate = DateTime.fromISO(user.createdAt).toFormat(
            "LLLL d, yyyy 'at' h:mm a"
          );
          setUserState((prev) => ({ ...prev, ...user, createdAt: newDate }));
        }
      } catch (err: any) {
        let error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      } finally {
        dispatch(setFormLoading(false));
      }
    };
    getUserProfile();
  }, [dispatch]);

  return { userState };
};

export default useUserProfile;
