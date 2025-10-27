import type { hostedGroupCard, nonHostedGroupCard } from "../types/groupTypes";
import createDate from "../helpers/createDate";
import "../styles/groups/GroupCard.scss";

type Props = {
  group: hostedGroupCard | nonHostedGroupCard;
  goToGroup: (id: string) => void;
};

const GroupCard: React.FC<Props> = ({ group, goToGroup }) => {
  return (
    <div
      onClick={() => goToGroup(group.id)}
      className="group-card"
      id={`group-${group.id}`}
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

export default GroupCard;
