import { type JSX, memo } from "react";
import { type UserCard } from "../types/userTypes";
import { MdPerson } from "react-icons/md";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import "../styles/users/UserSearchCard.scss";

type Props = {
  user: UserCard;
  handleUserCardKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    username: string,
  ) => void;
};

// reusable React component that contains data on a single user in a filtered list of users
// in a user search list
const UserSearchCard: React.FC<Props> = memo(
  ({ user, handleUserCardKeyDown }): JSX.Element => {
    const navigate: NavigateFunction = useNavigate();
    return (
      <div
        onClick={() => navigate(`/user/${user.username}`)}
        onKeyDown={(e) => handleUserCardKeyDown(e, user.username)}
        className="user-search-card"
        role="User Search Card"
        tabIndex={0}
      >
        <div className="header">
          <div
            className="user-logo"
            style={{ backgroundColor: user.favoritecolor }}
          >
            <MdPerson />
          </div>
          <h3 id="username">{user.username}</h3>
        </div>

        <div className="interest-list">
          <h3>Interests</h3>
          <ul>
            {user.interests.map((i, index) => {
              return <li key={`${user.username}-interest-${index}`}>{i}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  },
);

export default UserSearchCard;
