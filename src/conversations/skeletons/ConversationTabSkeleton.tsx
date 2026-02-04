import { memo } from "react";
import Skeleton from "react-loading-skeleton";

const ConversationTabSkeleton = memo(() => {
  return (
    <div className={`conversation-tab`}>
      <p className="conversation-header">
        <Skeleton />
      </p>
      <div className="latest-message">
        <Skeleton />
      </div>

      <small className="last-updated-at">
        <Skeleton />
      </small>
    </div>
  );
});

export default ConversationTabSkeleton;
