import { type JSX, memo } from "react";
import { type UserCard } from "../types/userTypes";
import { MdPerson } from "react-icons/md";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import "../styles/users/UserSearchCard.scss";

type Props = {
  user: UserCard;
};

// reusable React component that contains data on a single user in a filtered list of users
// in a user search list
const UserSearchCard: React.FC<Props> = memo(({ user }): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div
      onClick={() => navigate(`/user/${user.username}`)}
      className="user-search-card"
    >
      <div className="header">
        <div
          className="user-logo"
          style={{ backgroundColor: user.favoritecolor }}
        >
          <MdPerson />
        </div>
        <h3>{user.username}</h3>
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
});

export default UserSearchCard;
