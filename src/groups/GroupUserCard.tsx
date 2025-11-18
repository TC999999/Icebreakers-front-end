import { memo } from "react";
import type { groupUser } from "../types/userTypes";
import "../styles/groups/GroupUserCard.scss";
import { MdPerson } from "react-icons/md";
import { useNavigate, type NavigateFunction } from "react-router-dom";

type Props = { user: groupUser };

// reusable react component for card in GroupPage.tsx that shows an individual user in the list
// of users in the group
const GroupUserCard: React.FC<Props> = memo(({ user }) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div
      onClick={() => navigate(`/user/${user.username}`)}
      className="group-user-card"
    >
      <div
        className="user-logo"
        style={{ backgroundColor: user.favoriteColor }}
      >
        <MdPerson />
      </div>
      {user.username}
    </div>
  );
});

export default GroupUserCard;
