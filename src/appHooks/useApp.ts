import { useEffect } from "react";
import { useAppDispatch } from "../features/hooks";
import { type AppDispatch } from "../features/store";
import { getCurrentUser } from "../features/actions/auth";

const useApp = () => {
  const dispatch: AppDispatch = useAppDispatch();

  useEffect((): void => {
    const getUserInfo = async () => {
      await dispatch(getCurrentUser({}));
    };
    getUserInfo();
  }, [dispatch]);
};

export default useApp;
