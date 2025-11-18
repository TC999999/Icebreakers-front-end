import useUserProfile from "./hooks/useUserProfile";
import { MdPerson } from "react-icons/md";
import "../styles/users/UserProfile.scss";
import { useAppSelector } from "../features/hooks";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { shallowEqual } from "react-redux";

// React component for user profile page; shows a user's username, description, interest list,
// and joined date. Shows different buttons and messages if the profile the user if viewing is
// their own or not (shows edit profile  button if this is their own page, or a request conversation
// button if not), also shows different messages if the user has requested a conversation with a
// user on a profile page that is not their own

const UserProfile = () => {
  const { userState } = useUserProfile();
  const navigate: NavigateFunction = useNavigate();

  const { user } = useAppSelector((store) => {
    return store.user;
  }, shallowEqual);
  return (
    <main id="user-profile-page">
      <section id="user-profile-introduction">
        <div id="user-header" className="profile-section">
          <div
            id="profile-pic"
            style={{ backgroundColor: userState.favoriteColor }}
          >
            <MdPerson />
          </div>
          <h2>{userState.username}</h2>
        </div>
        <div id="about-user">
          <section id="user-biography" className="profile-section">
            <h3>About {userState.username}</h3>
            <p>{userState.biography}</p>
          </section>
          <section id="interests-list" className="profile-section">
            <h4>Interests Include:</h4>
            <ul>
              {userState.interests.map((i, index) => {
                return <li key={`interest-${index}`}>{i}</li>;
              })}
            </ul>
          </section>
        </div>
        <div id="additional-info">
          <small>
            <b>Joined On: </b>
            {userState.createdAt}
          </small>
        </div>

        <div id="button-row">
          {user?.username === userState.username ? (
            <div>
              <button
                onClick={() => navigate(`/user/${userState.username}/edit`)}
              >
                Edit Profile
              </button>
              <button>View Blocked List</button>
            </div>
          ) : (
            <div>
              {userState.requestSent && !userState.conversationExists && (
                <p id="request-message">Request Has Already Been Sent!</p>
              )}

              {!userState.requestSent && userState.conversationExists && (
                <p id="request-message">
                  You are already chatting with this user!
                </p>
              )}

              {!userState.requestSent && !userState.conversationExists && (
                <button
                  id="send-request-button"
                  onClick={() => navigate(`/request/${userState.username}`)}
                >
                  Request Conversation
                </button>
              )}
              <button
                id="invite-to-group-button"
                onClick={() => navigate(`/groups/invite/${userState.username}`)}
              >
                Invite to a Group
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default UserProfile;
