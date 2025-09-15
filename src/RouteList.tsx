import { type JSX } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LogIn from "./auth/LogIn";
import SignUp from "./auth/SignUp";
import HomePage from "./home/HomePage";
import NotFound from "./NotFound";
import Error from "./Error";
import UserProfile from "./users/UserProfile";
import UserSearch from "./users/UserSearch";
import RequestPage from "./requests/RequestPage";
import RequestError from "./requests/RequestError";
import UserRoutes from "./routes/UserRoutes";
import LoggedOutRoutes from "./routes/LoggedOutRoutes";
import { useAppSelector } from "./features/hooks";

const RouteList = (): JSX.Element | null => {
  const location = useLocation();
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading
  );

  return !loading ? (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage />} />
      <Route element={<LoggedOutRoutes />}>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<SignUp />} />
      </Route>
      <Route element={<UserRoutes />}>
        <Route path="/user">
          <Route path=":username" element={<UserProfile />} />
          <Route path="search" element={<UserSearch />} />
        </Route>
        <Route path="/request">
          <Route path=":requestedUser" element={<RequestPage />} />
        </Route>
        <Route path="/requestError" element={<RequestError />} />
      </Route>
      <Route path="/error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : null;
};

export default RouteList;
