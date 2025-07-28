import { type JSX } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LogIn from "./auth/LogIn";
import SignUp from "./auth/SignUp";
import HomePage from "./home/HomePage";
import NotFound from "./NotFound";
import { useAppSelector } from "./features/hooks";

const RouteList = (): JSX.Element | null => {
  const location = useLocation();
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading
  );

  return !loading ? (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : null;
};

export default RouteList;
