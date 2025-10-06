import { useEffect } from "react";
import { useAppDispatch } from "../features/hooks";
import { type AppDispatch } from "../features/store";
import { getCurrentUser } from "../features/actions/auth";
import { useAppSelector } from "../features/hooks";
import type { UserState } from "../types/authTypes";
import socket from "../helpers/socket";
import { setUnansweredRequests } from "../features/slices/auth";

const useApp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const user: UserState | null = useAppSelector((store) => {
    return store.user.user;
  });

  useEffect((): void => {
    const getUserInfo = async () => {
      await dispatch(getCurrentUser({}));
    };
    getUserInfo();
  }, [dispatch]);

  useEffect((): (() => void) | undefined => {
    if (user) {
      socket.on("updateUnansweredRequests", ({ unansweredRequests }) => {
        dispatch(setUnansweredRequests(unansweredRequests.unansweredRequests));
        socket.emit("updateUnansweredRequests", { unansweredRequests });
      });

      return () => {
        socket.off("updateUnansweredRequests");
      };
    }
  }, [user]);
};

export default useApp;
