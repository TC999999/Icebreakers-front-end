import { memo } from "react";
import type { HostedGroupCard, NonHostedGroupCard } from "../types/groupTypes";
import createDate from "../helpers/createDate";
import "../styles/groups/GroupCard.scss";

type Props = {
  group: HostedGroupCard | NonHostedGroupCard;
  navigateGroup: (id: string) => void;
  handleKeyDownGroupCard: (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => void;
};

// reusable React component for card with simple group data for groups the user is already a member
// of
const GroupCard: React.FC<Props> = ({
  group,
  navigateGroup,
  handleKeyDownGroupCard,
}) => {
  return (
    <div
      onClick={() => navigateGroup(group.id)}
      onKeyDown={(e) => handleKeyDownGroupCard(e, group.id)}
      className="group-card"
      id={`group-${group.id}`}
      tabIndex={0}
      role="Group Card"
      aria-label="Group Card"
    >
      <h3>{group.title}</h3>
      {"host" in group && <h4>Hosted By: {group.host}</h4>}
      <small>
        <b>Created At: </b>
        {createDate(group.createdAt, "long")}
      </small>
    </div>
  );
};

export default memo(GroupCard);
