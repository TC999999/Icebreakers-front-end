import { type JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { type AppDispatch } from "../features/store";
import { LogOutUser } from "../features/actions/auth";

const NavBar = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const { user } = useAppSelector((store) => store.user, shallowEqual);

  const logOutAndNavigate = async () => {
    await dispatch(LogOutUser({}));

    navigate("/");
  };
  return (
    <div id="nav-bar">
      <div id="user-info">
        {user ? (
          <button onClick={() => logOutAndNavigate()}>Log Out</button>
        ) : (
          <button onClick={() => navigate("/login")}>Log In</button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
