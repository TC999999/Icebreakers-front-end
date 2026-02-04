import { memo } from "react";
import Skeleton from "react-loading-skeleton";

const GroupSearchCardSkeleton = memo(() => {
  return (
    <div className="group-search-card">
      <header>
        <h2>
          <Skeleton />
        </h2>
        <h4>
          <Skeleton />
        </h4>
      </header>
      <div className="group-info">
        <div className="data-list interest-list">
          <h3>Interests</h3>
          <ul>
            <li key={`skeleton-interest-1`}>
              <Skeleton />
            </li>
            <li key={`skeleton-interest-2`}>
              <Skeleton />
            </li>
            <li key={`skeleton-interest-3`}>
              <Skeleton />
            </li>
          </ul>
        </div>

        <div className="data-list user-list">
          <h3>Users</h3>
          <ul>
            <li key={`skeleton-user-1`}>
              <Skeleton />
            </li>
            <li key={`skeleton-user-2`}>
              <Skeleton />
            </li>
            <li key={`skeleton-user-3`}>
              <Skeleton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default GroupSearchCardSkeleton;
