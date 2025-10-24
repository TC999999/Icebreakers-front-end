import { type JSX } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import useNavbar from "./hooks/useNavbar";
import "../styles/Navbar.scss";
import { MdPerson } from "react-icons/md";

const NavBar = (): JSX.Element => {
  const { user } = useAppSelector((store) => store.user, shallowEqual);

  const { selectedNav, logOutAndNavigate, move, resetNav } = useNavbar();

  return (
    <nav id="nav-bar">
      <div id="logo">
        <h1>
          <Link onClick={resetNav} to="/">
            Join The Conversation!
          </Link>
        </h1>
      </div>

      <div id="navigation-buttons">
        {user ? (
          <div className="tabs">
            <div id="scrollable-tabs">
              <div className="navlink">
                {user.unreadMessages > 0 && (
                  <div className="notification-label">
                    {user.unreadMessages}
                  </div>
                )}
                <button
                  name="conversations"
                  value={"/conversations"}
                  onClick={move}
                  className={
                    selectedNav === "conversations" ? "selectedNav" : ""
                  }
                >
                  Conversations
                </button>
              </div>
              <div className="navlink">
                <button
                  name="groups"
                  value={"/groups"}
                  onClick={move}
                  className={selectedNav === "groups" ? "selectedNav" : ""}
                >
                  Groups
                </button>
              </div>
              <div className="navlink">
                <button
                  name="searchUsers"
                  value={"/user/search"}
                  onClick={move}
                  className={selectedNav === "searchUsers" ? "selectedNav" : ""}
                >
                  Search For Friends
                </button>
              </div>
              <div className="navlink">
                <button>Search For Groups</button>
              </div>
              <div className="navlink">
                {user.unansweredRequests > 0 && (
                  <div className="notification-label">
                    {user.unansweredRequests}
                  </div>
                )}
                <button
                  name="requests"
                  value={"/request"}
                  onClick={move}
                  className={selectedNav === "requests" ? "selectedNav" : ""}
                >
                  Requests
                </button>
              </div>
            </div>
            <div id="user-tabs">
              <button
                id="user-button"
                style={{ backgroundColor: user.favoriteColor }}
                title={user.username}
                name="userProfile"
                value={`/user/${user?.username}`}
                onClick={move}
                className={selectedNav === "userProfile" ? "selectedUser" : ""}
              >
                <MdPerson />
              </button>
              <button
                className="auth-button"
                id="logout-button"
                onClick={() => logOutAndNavigate()}
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="tabs" id="logged-out-tabs">
            <button
              className="auth-button"
              id="login-button"
              name="login"
              value={"/login"}
              onClick={move}
            >
              Log In
            </button>
            <button
              className="auth-button"
              id="register-button"
              name="register"
              value={"/register"}
              onClick={move}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
