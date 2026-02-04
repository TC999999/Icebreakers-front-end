import React from "react";
import GroupSearchCardSkeleton from "./GroupSearchCardSkeleton";

type Props = { cards: number };

const GroupSearchSkeleton: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => <GroupSearchCardSkeleton key={`skelton-group-${i}`} />);
};

export default GroupSearchSkeleton;
