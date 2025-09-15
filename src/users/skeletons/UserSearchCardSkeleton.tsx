import { type JSX } from "react";
import Skeleton from "react-loading-skeleton";
import { MdPerson } from "react-icons/md";
import "../../styles/UserSearchCard.scss";

const UserSearchCardSkeleton = (): JSX.Element => {
  return (
    <div className="user-search-card">
      <div className="header">
        <div className="user-logo">
          <MdPerson />
        </div>
        <h3>
          <Skeleton />
        </h3>
      </div>

      <ul>
        <h3>Interests</h3>
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
  );
};

export default UserSearchCardSkeleton;
