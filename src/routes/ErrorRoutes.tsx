import { shallowEqual } from "react-redux";
import { useAppSelector } from "../features/hooks";
import { Outlet, Navigate } from "react-router-dom";
import type { LoadingError } from "../types/authTypes";

// protects route to error page to only allow access if error exists in redux state
const ErrorRoutes = () => {
  const { status }: LoadingError = useAppSelector(
    (store) => store.loading.loadingError,
    shallowEqual,
  );

  return status ? <Outlet /> : <Navigate to="/" />;
};

export default ErrorRoutes;
