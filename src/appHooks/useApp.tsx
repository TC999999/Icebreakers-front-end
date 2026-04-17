import { useEffect } from "react";
import { useAppDispatch } from "../features/hooks";
import type { AppDispatch } from "../features/store";
import { getCurrentUser } from "../features/actions/auth";
import { useAppSelector } from "../features/hooks";
import type { UserState } from "../types/authTypes";
import socket from "../helpers/socket";
import {
  setUnansweredRequests,
  setUnreadDirectMessages,
  setUnreadGroupMessages,
} from "../features/slices/auth";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import CustomToastContent from "../ToastContent";
import type { ToastProps } from "../types/miscTypes";
import {
  useLocation,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { setUpInterceptors } from "../apis/axiosInstance";

// basic app hook that handles basic notifications, user info retrieval and redux state setting, and
// unanswered message/request count on initial rendering of app
const useApp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const notify = ({ message, from, group }: ToastProps) => {
    toast(<CustomToastContent message={message} from={from} group={group} />);
  };
  // const notifyError = (message: string) => toast.error(message);
  const user: UserState | null = useAppSelector((store) => {
    return store.user.user;
  }, shallowEqual);

  // on initial render, checks if user session id exists in backend session
  useEffect((): void => {
    const getUserInfo = async () => {
      await dispatch(getCurrentUser({}));
      setUpInterceptors(navigate, dispatch);
    };
    getUserInfo();
  }, []);

  // allows users to receive real time notifications from server when another user sends them a
  // message or request; if user is already in location specified in path name, will not give
  // notification to prevent redundancy
  useEffect((): (() => void) | undefined => {
    if (user) {
      socket.on("notify", ({ message, from, pathname, group }) => {
        if (pathname !== location.pathname) notify({ message, from, group });
      });

      return () => {
        socket.off("notify");
      };
    }
  }, [user, location.pathname]);

  // socket signal listener for updates to numeric notification values for both conversations
  // and requests
  useEffect((): (() => void) | undefined => {
    if (user) {
      socket.on("updateUnansweredRequests", ({ change }) => {
        dispatch(setUnansweredRequests(change));
      });

      socket.on("increaseUnreadDirectMessages", () => {
        dispatch(setUnreadDirectMessages(1));
      });

      socket.on("increaseUnreadGroupMessages", () => {
        dispatch(setUnreadGroupMessages(1));
      });

      return () => {
        socket.off("updateUnansweredRequests");
        socket.off("increaseUnreadDirectMessages");
        socket.off("increaseUnreadGroupMessages");
      };
    }
  }, [user]);
};

export default useApp;
