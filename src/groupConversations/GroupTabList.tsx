import React from "react";
import type { GroupTab as GT, SimpleGroup } from "../types/groupTypes";
import GroupTab from "./GroupTab";
import "../styles/groupConversations/GroupTabList.scss";

type Props = {
  selectedGroup: SimpleGroup;
  groupTabList: GT[];
  changeSelectedTab: (id: string, unreadMessages: number) => Promise<void>;
};

const GroupTabList: React.FC<Props> = ({
  selectedGroup,
  groupTabList,
  changeSelectedTab,
}) => {
  return (
    <div id="group-tab-list">
      {groupTabList.map((tab) => (
        <GroupTab
          key={`tab-${tab.id}`}
          selected={selectedGroup.id === tab.id}
          group={tab}
          changeSelectedTab={changeSelectedTab}
        />
      ))}
    </div>
  );
};

export default GroupTabList;
