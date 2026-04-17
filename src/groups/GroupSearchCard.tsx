import React, { memo } from "react";
import type { GroupSearchCard } from "../types/groupTypes";
import "../styles/groups/GroupSearchCard.scss";
import { MdPerson } from "react-icons/md";
import { useNavigate, type NavigateFunction } from "react-router-dom";

type Props = GroupSearchCard;

// reusable React component for card of group data that appears when a user searches for groups:
// contains group title, host, list of interests, and list of users in group
const GroupSearchCard: React.FC<Props> = ({
  id,
  title,
  host,
  interests,
  users,
  handleGroupSearchCardKeyDown,
  handleGroupSearchCardKeyUp,
}) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div
      onClick={() => navigate(`/groups/${id}`)}
      className="group-search-card"
      id={`group-${id}`}
      role="option"
      onKeyDown={(e) => handleGroupSearchCardKeyDown(e, id)}
      onKeyUp={handleGroupSearchCardKeyUp}
      tabIndex={0}
    >
      <header>
        <h2>{title}</h2>
        <h4>Hosted By: {host}</h4>
      </header>
      <div className="group-info">
        <div className="data-list user-list">
          <h3>Users</h3>
          <ul tabIndex={-1} role="region" aria-label="Group Users List">
            {users.map((v, i) => {
              return (
                <li key={`group-${id}-users-${i}`}>
                  <MdPerson style={{ color: v.favoriteColor }} />
                  {v.username}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="data-list interest-list">
          <h3>Interests</h3>
          <ul tabIndex={-1} role="region" aria-label="Group Interests List">
            {interests.map((v, i) => (
              <li key={`group-${id}-interests-${i}`}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(GroupSearchCard);
