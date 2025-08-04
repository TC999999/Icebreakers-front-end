import { shallowEqual } from "react-redux";
import { useAppSelector } from "../features/hooks";
import { Outlet, Navigate } from "react-router-dom";
import { type UserState } from "../types/authTypes";

// protects routes that require user to be logged in to access
const UserRoutes = () => {
  const userState: UserState | null = useAppSelector(
    (store) => store.user.user,
    shallowEqual
  );

  return userState ? <Outlet /> : <Navigate to="/" />;
};

export default UserRoutes;
