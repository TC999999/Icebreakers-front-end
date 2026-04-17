import { useCallback } from "react";
import { useAppDispatch } from "../features/hooks";
import type { AppDispatch } from "../features/store";
import { setLoadError } from "../features/slices/loading";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

const useRequestErrorHandler = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (message: string) => toast.error(message);

  const handleMountRequestError = useCallback((error: any) => {
    const err = JSON.parse(error.message);
    dispatch(setLoadError(err));
    navigate("/error");
  }, []);

  const handleSubmitRequestError = useCallback((error: any) => {
    const err = JSON.parse(error.message);
    notify(err.message);
  }, []);

  return { handleMountRequestError, handleSubmitRequestError };
};

export default useRequestErrorHandler;
