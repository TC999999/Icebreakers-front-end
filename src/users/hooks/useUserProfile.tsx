import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import {
  useNavigate,
  type NavigateFunction,
  createSearchParams,
} from "react-router-dom";
import { setFormLoading, setLoadError } from "../../features/slices/auth";
import { type UserProfile } from "../../types/userTypes";
import userAPI from "../../apis/userAPI";
import createDate from "../../helpers/createDate";
import directConversationsAPI from "../../apis/directConversationsAPI";

// custom hook for user profile page
const useUserProfile = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const currentUser = useAppSelector((store) => store.user.user?.username);
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

  // redirects user to messsages page while injecting the conversation id (if it exists) into
  // the url
  const goToMessages = useCallback(async () => {
    if (currentUser && username) {
      dispatch(setFormLoading(true));
      let res = await directConversationsAPI.getConversationID(
        currentUser,
        username
      );

      navigate({
        pathname: "/conversations",
        search: `?${createSearchParams({ id: res.id })}`,
      });
      dispatch(setFormLoading(false));
    }
  }, [username, currentUser]);

  return { userState, goToMessages };
};

export default useUserProfile;
