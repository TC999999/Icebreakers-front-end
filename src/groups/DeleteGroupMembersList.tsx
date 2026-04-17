import React from "react";
import type { GroupUser } from "../types/userTypes";
import DeleteGroupMemberCard from "./DeleteGroupMemberCard";
import "../styles/groups/DeleteGroupMembersList.scss";

type Props = {
  groupUsers: GroupUser[];
  handleRemoveButton: (
    e: React.MouseEvent<HTMLButtonElement>,
    username: string,
  ) => void;
};

const DeleteGroupMembersList: React.FC<Props> = ({
  groupUsers,
  handleRemoveButton,
}) => {
  return (
    <ul id="delete-group-members-list">
      {groupUsers.map((u) => (
        <DeleteGroupMemberCard
          key={`delete-user-card-${u.username}`}
          groupUser={u}
          handleRemoveButton={handleRemoveButton}
        />
      ))}
    </ul>
  );
};

export default DeleteGroupMembersList;
