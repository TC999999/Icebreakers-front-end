import { type JSX } from "react";
import { useNavigate, type NavigateFunction, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { type AppDispatch } from "../features/store";
import { LogOutUser } from "../features/actions/auth";
import "../styles/Navbar.scss";
import { MdPerson } from "react-icons/md";

const NavBar = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const { user } = useAppSelector((store) => store.user, shallowEqual);

  const logOutAndNavigate = async () => {
    await dispatch(LogOutUser({}));
    navigate("/");
  };

  const goToProfile = () => {
    navigate(`/user/${user?.username}`);
  };

  const goToSearch = () => {
    navigate("/user/search");
  };

  return (
    <nav id="nav-bar">
      <div id="logo">
        <h1>
          <Link to="/">Join The Conversation!</Link>
        </h1>
      </div>

      <div id="buttons">
        {user && (
          <div id="tabs">
            <button>Conversations</button>
            <button onClick={goToSearch}>Search For Friends</button>
          </div>
        )}
        <div id="user-info">
          {user ? (
            <div id="logged-in-links">
              <button
                id="user-button"
                style={{ backgroundColor: user.favoriteColor }}
                title={user.username}
                onClick={goToProfile}
              >
                <MdPerson />
              </button>

              <button onClick={() => logOutAndNavigate()}>Log Out</button>
            </div>
          ) : (
            <div id="logged-out-links">
              <button
                className="auth-button"
                id="login-button"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="auth-button"
                id="register-button"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
