import { type JSX } from "react";
import { type UserCard } from "../types/userTypes";
import { MdPerson } from "react-icons/md";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import "../styles/UserSearchCard.scss";

type Props = {
  user: UserCard;
};

const UserSearchCard: React.FC<Props> = ({ user }): JSX.Element => {
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

      <ul>
        <h3>Interests</h3>
        {user.interests.map((i, index) => {
          return <li key={`${user.username}-interest-${index}`}>{i}</li>;
        })}
      </ul>
    </div>
  );
};

export default UserSearchCard;
