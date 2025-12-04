import { memo } from "react";
import type { groupTab } from "../types/groupTypes";
import "../styles/groupConversations/GroupTab.scss";

type Props = {
  group: groupTab;
  selected: boolean;
  changeSelectedTab: (id: string) => void;
};

const GroupTab: React.FC<Props> = memo(
  ({ group, selected, changeSelectedTab }) => {
    return (
      <div
        className={`group-message-tab ${selected ? "selected" : ""}`}
        onClick={() => changeSelectedTab(group.id)}
      >
        {group.title}
      </div>
    );
  }
);

export default GroupTab;
