import React from "react";
import type { groupTab } from "../types/groupTypes";
import GroupTab from "./GroupTab";
import "../styles/groupConversations/GroupTabList.scss";

type Props = {
  selectedGroup: string;
  groupTabList: groupTab[];
  changeSelectedTab: (id: string) => void;
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
          selected={selectedGroup === tab.id}
          group={tab}
          changeSelectedTab={changeSelectedTab}
        />
      ))}
    </div>
  );
};

export default GroupTabList;
