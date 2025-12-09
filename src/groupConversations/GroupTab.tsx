import { memo } from "react";
import type { groupTab } from "../types/groupTypes";
import "../styles/groupConversations/GroupTab.scss";

type Props = {
  group: groupTab;
  selected: boolean;
  changeSelectedTab: (id: string, unreadMessages: number) => Promise<void>;
};

const GroupTab: React.FC<Props> = memo(
  ({ group, selected, changeSelectedTab }) => {
    return (
      <div
        className={`group-message-tab ${selected ? "selected" : ""}`}
        onClick={() => changeSelectedTab(group.id, group.unreadMessages)}
      >
        {group.unreadMessages > 0 && (
          <div className="notification-label">{group.unreadMessages}</div>
        )}
        {group.title}
      </div>
    );
  }
);

export default GroupTab;
