import { useEffect } from "react";
import { useAppDispatch } from "../features/hooks";
import { type AppDispatch } from "../features/store";
import { getCurrentUser } from "../features/actions/auth";
import { useAppSelector } from "../features/hooks";
import type { UserState } from "../types/authTypes";
import socket from "../helpers/socket";
import {
  setUnansweredRequests,
  setUnreadMessages,
} from "../features/slices/auth";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import CustomToastContent from "../ToastContent";
import type { ToastProps } from "../types/miscTypes";
import { useLocation } from "react-router-dom";

// basic app hook that handles basic notifications, user info retrieval and redux state setting, and
// unanswered message/request count on initial rendering of app
const useApp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const location = useLocation();
  const notify = ({ message, from }: ToastProps) => {
    toast(<CustomToastContent message={message} from={from} />);
  };
  const user: UserState | null = useAppSelector((store) => {
    return store.user.user;
  }, shallowEqual);

  // on initial render, checks if user exists in backend session
  useEffect((): void => {
    const getUserInfo = async () => {
      await dispatch(getCurrentUser({}));
    };
    getUserInfo();
  }, [dispatch]);

  // allows users to receive real time notifications from server when another user sends them a
  // message or request; if user is already in location specified in path name, will not give
  // notification to prevent redundancy
  useEffect((): (() => void) | undefined => {
    if (user) {
      socket.on("notify", ({ message, from, pathname }) => {
        if (pathname !== location.pathname) notify({ message, from });
      });

      return () => {
        socket.off("notify");
      };
    }
  }, [location.pathname]);

  useEffect((): (() => void) | undefined => {
    if (user) {
      socket.on("updateUnansweredRequests", ({ change }) => {
        dispatch(setUnansweredRequests(change));
      });

      socket.on("increaseUnreadMessages", () => {
        dispatch(setUnreadMessages(1));
      });

      return () => {
        socket.off("updateUnansweredRequests");
        socket.off("increaseUnreadMessages");
      };
    }
  }, [user, dispatch]);
};

export default useApp;
