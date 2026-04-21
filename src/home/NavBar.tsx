import type { JSX } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import useNavbar from "./hooks/useNavbar";
import "../styles/Navbar.scss";
import { MdPerson } from "react-icons/md";
import NavButton from "./NavButton";

// React component for navbar component; includes navigation buttons for when the user is logged out
// (Log In and Sign Up), and when the user is logged in (conversations, groups, search users, search
// groups, request inbox, user profile, and log out)
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
              <NavButton
                selectedNav={selectedNav}
                name="conversations"
                value="/conversations"
                title="Conversations"
                onClick={move}
                unreadNotifications={user.unreadDirectMessages}
              />
              <NavButton
                selectedNav={selectedNav}
                name="groupConversations"
                value="/conversations/groups"
                title="Group Conversations"
                onClick={move}
                unreadNotifications={user.unreadGroupMessages}
              />
              <NavButton
                selectedNav={selectedNav}
                name="groups"
                value="/groups?type=hosted"
                title="Groups"
                onClick={move}
              />
              <NavButton
                selectedNav={selectedNav}
                name="searchUsers"
                value="/user/search"
                title="Search For Friends"
                onClick={move}
              />
              <NavButton
                selectedNav={selectedNav}
                name="searchGroups"
                value="/groups/search"
                title="Search For Groups"
                onClick={move}
              />
              <NavButton
                selectedNav={selectedNav}
                name="requests"
                value="/request?directOrGroup=direct&requestOrInvitation=requests&type=received"
                title="Requests"
                onClick={move}
                unreadNotifications={user.unansweredRequests}
              />
            </div>
            <div id="user-tabs">
              <button
                id="user-button"
                style={{ backgroundColor: user.favoriteColor }}
                title={user.username}
                name="userProfile"
                value={`/user/${user?.username}`}
                onClick={move}
                aria-label="userProfile"
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
            <NavButton
              selectedNav={selectedNav}
              name="login"
              value="/login"
              title="Log In"
              onClick={move}
            />
            <NavButton
              selectedNav={selectedNav}
              name="register"
              value="/register"
              title="Register"
              onClick={move}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
