import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "../../styles/requests/RequestCard.scss";

const RequestCardSkeleton = memo(() => {
  return (
    <li>
      <div className="request-card">
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
          <div className="response-buttons" id="received-response">
            <Skeleton />
          </div>
        </div>
      </div>
    </li>
  );
});

export default RequestCardSkeleton;
