import { memo } from "react";
import type { groupUserTab } from "../types/userTypes";
import "../styles/groupConversations/GroupUserTab.scss";
import { MdPerson } from "react-icons/md";

type Props = { user: groupUserTab };

const GroupUserTab: React.FC<Props> = memo(({ user }) => {
  return (
    <div className="group-user-tab">
      <div
        className="profile-pic"
        style={{ backgroundColor: user.favoriteColor }}
      >
        <MdPerson />
      </div>
      <div>
        <p>{user.username}</p>
        <span>{user.isOnline ? "online" : "offline"}</span>
      </div>
    </div>
  );
});

export default GroupUserTab;
