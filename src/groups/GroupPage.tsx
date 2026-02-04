import useGroupPage from "./hooks/useGroupPage";
import createDate from "../helpers/createDate";
import GroupUserCard from "./GroupUserCard";
import "../styles/groups/GroupPage.scss";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";

// group page react component: shows all group information (title, host, description, interest list),
// as well as all users in the group. Displays different buttons/messages depnding if user has
// sent a request to join, received an invitation to join, is a member of the group, or none of
// the above
const GroupPage = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );
  const {
    group,
    isInGroupState,
    requestPendingState,
    invitationPendingState,
    handleNavigateRequest,
    handleNavigateDeleteMember,
    handleNavigateConversations,
  } = useGroupPage();

  return (
    <main id="group-page">
      <header>
        <h1>{group.title}</h1>
      </header>

      <div id="group-info">
        <h2>
          <b>Hosted By: </b>
          {group.host}
        </h2>
        <div id="group-about">
          <section id="about-group">
            <h4>About</h4>
            <p>{group.description}</p>
          </section>
          <section id="group-interests">
            <ul>
              <h4>Interests</h4>
              <div id="group-interest-list-items">
                {group.interests.map((i) => {
                  return <li key={`interest-${i}`}>{i}</li>;
                })}
              </div>
            </ul>
          </section>
        </div>
        <p>
          <b>Created At: </b> {createDate(group.createdAt, "long")}
        </p>

        <div id="button-row">
          {isInGroupState &&
            !requestPendingState &&
            !invitationPendingState && (
              <button
                className="submit-button"
                onClick={() => handleNavigateConversations()}
              >
                Go To Messages
              </button>
            )}

          {isInGroupState && username && username === group.host && (
            <button
              className="submit-button"
              onClick={(e) => handleNavigateDeleteMember(e)}
            >
              Remove Group Members
            </button>
          )}

          {!isInGroupState &&
            requestPendingState &&
            !invitationPendingState && (
              <p>Your request has already been made</p>
            )}
          {!isInGroupState &&
            !requestPendingState &&
            invitationPendingState && (
              <p>
                You have already received an invitation to join this group.
                Please check your request inbox.
              </p>
            )}
          {!isInGroupState &&
            !requestPendingState &&
            !invitationPendingState && (
              <button className="submit-button" onClick={handleNavigateRequest}>
                Request To Join
              </button>
            )}
        </div>
      </div>

      <div id="group-users">
        <h2>{group.title} members</h2>
        <div id="user-list">
          {group.users.map((u) => {
            return <GroupUserCard key={`user-${u.username}`} user={u} />;
          })}
        </div>
      </div>
    </main>
  );
};

export default GroupPage;
