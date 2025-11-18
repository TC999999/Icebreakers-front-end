import { useNavigate, type NavigateFunction } from "react-router-dom";
import useGroupList from "./hooks/useGroupList";
import GroupCard from "./GroupCard";
import "../styles/groups/GroupList.scss";

// React component for a list of groups that user is a member of; either in which they are hosting
// and those that they are non hosting; they are separated by a tablist above
const GroupList = () => {
  const { hostedGroups, nonHostedGroups, currentGroupTab, handleGroupTab } =
    useGroupList();
  const navigate: NavigateFunction = useNavigate();

  const goToGroup = (id: string): void => {
    navigate(`/groups/${id}`);
  };

  return (
    <main>
      <header id="page-header">
        <h1>Your Groups</h1>
      </header>
      <section id="group-tab-window">
        <header id="group-tabs">
          <div
            className={`group-tab ${
              currentGroupTab === "hostedGroups" ? "selected-group" : ""
            }`}
            title="hostedGroups"
            onClick={handleGroupTab}
          >
            Groups You Host
          </div>
          <div
            className={`group-tab ${
              currentGroupTab === "nonHostedGroups" ? "selected-group" : ""
            }`}
            title="nonHostedGroups"
            onClick={handleGroupTab}
          >
            Groups You Do Not Host
          </div>
        </header>

        <div
          className="groups-list-div"
          id="hosted-groups-list-div"
          hidden={currentGroupTab !== "hostedGroups"}
        >
          <header>
            <h2>Groups That You Host</h2>
            <p>These are groups that you have created yourself.</p>
          </header>
          <div id="make-group-button">
            <button onClick={() => navigate("/groups/new")}>
              Make A Group
            </button>
          </div>

          {hostedGroups.length > 0 ? (
            <div className="group-list" id="hosted-group-list">
              {hostedGroups.map((g) => {
                return (
                  <GroupCard
                    key={`hosted-group-${g.id}`}
                    group={g}
                    goToGroup={goToGroup}
                  />
                );
              })}
            </div>
          ) : (
            <div className="group-list">
              <i>You are not hosting a group</i>
            </div>
          )}
        </div>
        <div
          className="groups-list-div"
          id="non-hosted-groups-list-div"
          hidden={currentGroupTab !== "nonHostedGroups"}
        >
          <header>
            <h2>Groups Where You Are a Member</h2>
            <p>
              These Are groups that you did not create and have joined after
              being invited by another member or made a request to the host.
            </p>
          </header>

          {nonHostedGroups.length > 0 ? (
            <div className="group-list" id="non-hosted-group-list">
              {nonHostedGroups.map((g) => {
                return (
                  <GroupCard
                    key={`group-${g.id}`}
                    group={g}
                    goToGroup={goToGroup}
                  />
                );
              })}
            </div>
          ) : (
            <div className="group-list">
              <i>You are not a regular member of any groups</i>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default GroupList;
