import { type JSX } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LogIn from "./auth/LogIn";
import HomePage from "./home/HomePage";

const RouteList = (): JSX.Element => {
  const location = useLocation();

  return (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  );
};

export default RouteList;
