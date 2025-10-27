import useGroupPage from "./hooks/useGroupPage";
import createDate from "../helpers/createDate";
import GroupUserCard from "./GroupUserCard";
import "../styles/groups/GroupPage.scss";

const GroupPage = () => {
  const { group, isInGroup } = useGroupPage();

  return (
    <main id="group-page">
      <header>
        <h1>{group.title}</h1>
      </header>

      <div id="group-info">
        <p>
          <b>Hosted By: </b>
          {group.host}
        </p>
        <div id="about-group">
          <h4>About</h4>
          <p>{group.description}</p>
        </div>
        <div>
          <ul id="group-interests">
            <h4>Interests</h4>
            {group.interests.map((i) => {
              return <li key={`interest-${i}`}>{i}</li>;
            })}
          </ul>
        </div>
        <p>
          <b>Created At: </b> {createDate(group.createdAt, "long")}
        </p>

        <div id="button-row">
          {isInGroup ? (
            <button>Go To Messages</button>
          ) : (
            <button>Request To Join</button>
          )}
        </div>
      </div>

      <div id="group-users">
        <h2>{group.title} users</h2>
        {group.users.map((u) => {
          return <GroupUserCard key={`user-${u.username}`} user={u} />;
        })}
      </div>
    </main>
  );
};

export default GroupPage;
