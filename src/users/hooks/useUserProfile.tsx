import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { setFormLoading, setLoadError } from "../../features/slices/auth";
import { type UserProfile } from "../../types/userTypes";
import userAPI from "../../apis/userAPI";
import createDate from "../../helpers/createDate";

// custom hook for user profile page
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

  // on initial render, retrieves user information and sets it in state; if user does not exist, throws
  // an error and redirects user to error page
  useEffect((): void => {
    const getUserProfile = async () => {
      dispatch(setFormLoading(true));
      try {
        if (username) {
          let user = await userAPI.getUserProfile(username);
          setUserState((prev) => ({
            ...prev,
            ...user,
            createdAt: createDate(user.createdAt, "long"),
          }));
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
