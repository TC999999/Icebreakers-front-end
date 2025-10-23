import { useNavigate, type NavigateFunction } from "react-router-dom";

const GroupList = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <main>
      <div id="hosted-groups-list">
        <header>
          <h2>Groups That You Host</h2>
          <button onClick={() => navigate("/groups/new")}>Make A Group</button>
        </header>
      </div>
      <div id="member-groups-list">
        <h2>Groups Where You Are a Member</h2>
      </div>
    </main>
  );
};

export default GroupList;
