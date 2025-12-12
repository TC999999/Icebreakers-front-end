import React from "react";
import type { blockedUser } from "../types/userTypes";
import createDate from "../helpers/createDate";
import { MdPerson } from "react-icons/md";
import "../styles/blockUser/BlockedUsercard.scss";

type Props = {
  blockedUser: blockedUser;
  unblockUser: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    blockedUser: string
  ) => Promise<void>;
};

// reusable react component for blocked user card: includes username, date of blocking, and
// unblocking button that handles removing the card from the list
const BlockedUserCard: React.FC<Props> = ({ blockedUser, unblockUser }) => {
  return (
    <div className="blocked-user-card">
      <div className="blocked-user-identification">
        <div
          className="profile-pic"
          style={{ backgroundColor: blockedUser.favoriteColor }}
        >
          <MdPerson />
        </div>
        <h1>{blockedUser.username}</h1>
      </div>

      <div className="unblock-button">
        <button
          className="cancel-button"
          onClick={(e) => unblockUser(e, blockedUser.username)}
        >
          Unblock
        </button>
      </div>
      <div className="block-date">
        <p>
          <b>Blocked Since:</b> {createDate(blockedUser.blockedAt, "long")}
        </p>
      </div>
    </div>
  );
};

export default BlockedUserCard;
