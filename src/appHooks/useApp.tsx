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

const useApp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = ({ message, from }: ToastProps) => {
    toast(<CustomToastContent message={message} from={from} />);
  };
  const user: UserState | null = useAppSelector((store) => {
    return store.user.user;
  }, shallowEqual);

  useEffect((): void => {
    const getUserInfo = async () => {
      await dispatch(getCurrentUser({}));
    };
    getUserInfo();
  }, [dispatch]);

  useEffect((): (() => void) | undefined => {
    if (user) {
      socket.on("updateUnansweredRequests", ({ change }) => {
        dispatch(setUnansweredRequests(change));
      });

      socket.on("increaseUnreadMessages", () => {
        dispatch(setUnreadMessages(1));
      });

      socket.on("notify", ({ message, from }) => {
        notify({ message, from });
      });

      return () => {
        socket.off("updateUnansweredRequests");
        socket.off("increaseUnreadMessages");
        socket.off("notify");
      };
    }
  }, [user]);
};

export default useApp;
