import type { GroupUserTab as GT } from "../types/userTypes";
import GroupUserTab from "./GroupUserTab";
import "../styles/groupConversations/GroupUserTabList.scss";

type Props = { currentUsers: GT[] };

const GroupUserTabList: React.FC<Props> = ({ currentUsers }) => {
  return (
    <div id="group-user-tab-list">
      {currentUsers.map((user) => (
        <GroupUserTab key={`group-user-tab-${user.username}`} user={user} />
      ))}
    </div>
  );
};

export default GroupUserTabList;
