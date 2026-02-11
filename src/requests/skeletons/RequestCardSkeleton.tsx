import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "../../styles/requests/RequestCard.scss";

const RequestCardSkeleton = memo(() => {
  return (
    <div className="request-card request-card-skeleton">
      <h2>
        <Skeleton />
      </h2>

      <div className="request-message">
        <p>
          <Skeleton />
        </p>
      </div>

      <div>
        <span>
          <small>
            <Skeleton />
          </small>
        </span>
      </div>
      <div>
        <span>
          <small>
            <Skeleton />
          </small>
        </span>
      </div>

      <div id="response-list">
        <div className="response-buttons">
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </div>
  );
});

export default RequestCardSkeleton;
