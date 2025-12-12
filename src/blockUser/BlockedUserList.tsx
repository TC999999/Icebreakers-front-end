import React from "react";
import type { blockedUser } from "../types/userTypes";
import BlockedUserCard from "./BlockedUserCard";
import "../styles/blockUser/BlockedUserList.scss";

type Props = {
  blockedUsers: blockedUser[];
  unblockUser: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    blockedUser: string
  ) => Promise<void>;
};

// React component that shows full list of blocked user: maps out list of cards
const BlockedUserList: React.FC<Props> = ({ blockedUsers, unblockUser }) => {
  return (
    <section id="blocked-user-list">
      {blockedUsers.map((user) => {
        return (
          <BlockedUserCard
            key={`blocked-user-${user.username}`}
            blockedUser={user}
            unblockUser={unblockUser}
          />
        );
      })}
    </section>
  );
};

export default BlockedUserList;
