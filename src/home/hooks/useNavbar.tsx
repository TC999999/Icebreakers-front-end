import { useEffect, useState, useCallback } from "react";
import {
  useNavigate,
  type NavigateFunction,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { LogOutUser } from "../../features/actions/auth";
import selectNav from "../../helpers/selectNav";
import { shallowEqual } from "react-redux";

const useNavbar = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const location = useLocation();

  const [selectedNav, setSelectedNav] = useState<string>("none");

  //highlights current navbar link on initial render and when path name changes
  useEffect(() => {
    const nav = selectNav(location.pathname, username);
    setSelectedNav(nav);
  }, [location.pathname, username]);

  const logOutAndNavigate = async () => {
    await dispatch(LogOutUser({}));
    navigate("/");
  };

  //moves to linked page and highlights link in the navbar
  const move = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    navigate(value);
  }, []);

  // unselects all navbar links
  const resetNav = useCallback(() => {
    setSelectedNav("none");
  }, []);

  return {
    selectedNav,
    logOutAndNavigate,
    move,
    resetNav,
  };
};

export default useNavbar;
