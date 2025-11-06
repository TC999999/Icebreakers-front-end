import { useNavigate, type NavigateFunction } from "react-router-dom";
import useGroupList from "./hooks/useGroupList";
import GroupCard from "./GroupCard";
import "../styles/groups/GroupList.scss";

const GroupList = () => {
  const { hostedGroups, nonHostedGroups } = useGroupList();
  const navigate: NavigateFunction = useNavigate();

  const goToGroup = (id: string): void => {
    navigate(`/groups/${id}`);
  };

  return (
    <main>
      <div className="groups-list-div" id="hosted-groups-list-div">
        <header>
          <h2>Groups That You Host</h2>
        </header>
        <div id="make-group-button">
          <button onClick={() => navigate("/groups/new")}>Make A Group</button>
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
          <div className="group-list">You are not hosting a group</div>
        )}
      </div>
      <div className="groups-list-div" id="non-hosted-groups-list-div">
        <header>
          <h2>Groups Where You Are a Member</h2>
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
            You are not a regular member of any groups
          </div>
        )}
      </div>
    </main>
  );
};

export default GroupList;
