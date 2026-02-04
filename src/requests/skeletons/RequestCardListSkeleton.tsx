import React from "react";
import RequestCardSkeleton from "./RequestCardSkeleton";

type Props = { cards: number };

const RequestCardListSkeleton: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => <RequestCardSkeleton key={`request-card-skeleton-${i}`} />);
};

export default RequestCardListSkeleton;
