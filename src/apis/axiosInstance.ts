import axios, { type AxiosInstance } from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import { type NavigateFunction } from "react-router-dom";
import { type AppDispatch } from "../features/store";
import { setLoadError } from "../features/slices/loading";
import { clearUser } from "../features/slices/auth";

export type method = "get" | "post" | "patch" | "delete";

const notify = (message: string) =>
  toast.error(message, { toastId: "axios-error-toast" });

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const setUpInterceptors = (
  navigate: NavigateFunction,
  dispatch: AppDispatch,
) => {
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        dispatch(clearUser());
        notify(error.response.data.error.message);
        navigate("/login");
      } else if (error.response && error.response.status === 400) {
        notify(error.response.data.error.message);
      } else if (error.response && error.response.status === 403) {
        dispatch(setLoadError(error.response.data.error));
        navigate("/error");
      } else if (error.response && error.response.status === 500) {
        dispatch(
          setLoadError({
            status: 500,
            message:
              "An unexpected error occurred on the server. Please try again later.",
          }),
        );
        navigate("/error");
      }
      return Promise.reject(error);
    },
  );
};

export default axiosInstance;
