import React from "react";
import ConversationTabSkeleton from "./ConversationTabSkeleton";

type Props = { cards: number };

const ConversationTabLIstSkeleton: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => (
      <ConversationTabSkeleton key={`conversation-tab-skeleton-${i}`} />
    ));
};

export default ConversationTabLIstSkeleton;
