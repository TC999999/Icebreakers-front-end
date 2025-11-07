import useGroupPage from "./hooks/useGroupPage";
import createDate from "../helpers/createDate";
import GroupUserCard from "./GroupUserCard";
import "../styles/groups/GroupPage.scss";

const GroupPage = () => {
  const { group, isInGroupState, requestPendingState, handleNavigate } =
    useGroupPage();

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
              {group.interests.map((i) => {
                return <li key={`interest-${i}`}>{i}</li>;
              })}
            </ul>
          </section>
        </div>
        <p>
          <b>Created At: </b> {createDate(group.createdAt, "long")}
        </p>

        <div id="button-row">
          {isInGroupState && !requestPendingState && (
            <button>Go To Messages</button>
          )}

          {!isInGroupState && requestPendingState && (
            <p>Your request has already been made</p>
          )}
          {!isInGroupState && !requestPendingState && (
            <button onClick={handleNavigate}>Request To Join</button>
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
