import { shallowEqual } from "react-redux";
import { useAppSelector } from "../features/hooks";
import { Outlet, Navigate } from "react-router-dom";
import { type loadingError } from "../types/authTypes";

const ErrorRoutes = () => {
  const { status }: loadingError = useAppSelector(
    (store) => store.user.loading.loadingError,
    shallowEqual
  );

  return status ? <Outlet /> : <Navigate to="/" />;
};

export default ErrorRoutes;
