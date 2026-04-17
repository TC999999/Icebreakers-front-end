import React from "react";
import type { GroupUser } from "../types/userTypes";
import { MdPerson } from "react-icons/md";
import "../styles/groups/DeleteGroupMemberCard.scss";

type Props = {
  groupUser: GroupUser;
  handleRemoveButton: (
    e: React.MouseEvent<HTMLButtonElement>,
    username: string,
  ) => void;
};

const DeleteGroupMemberCard: React.FC<Props> = ({
  groupUser,
  handleRemoveButton,
}) => {
  return (
    <div className="delete-group-member-card">
      <div className="user-info">
        <div
          className="profile-pic"
          style={{ backgroundColor: groupUser.favoriteColor }}
        >
          <MdPerson />
        </div>
        <h2>{groupUser.username}</h2>
      </div>
      <div className="delete-button-div">
        <button
          className="delete-button"
          onClick={(e) => handleRemoveButton(e, groupUser.username)}
        >
          Remove User
        </button>
      </div>
    </div>
  );
};

export default DeleteGroupMemberCard;
