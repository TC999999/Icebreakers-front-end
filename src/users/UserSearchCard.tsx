import { type JSX } from "react";
import { type UserCard } from "../types/userTypes";

type Props = {
  user: UserCard;
};

const UserSearchCard: React.FC<Props> = ({ user }): JSX.Element => {
  return (
    <div>
      <h3>{user.username}</h3>
      <ul>
        {user.interests.map((i, index) => {
          return <li key={`${user.username}-interest-${index}`}>{i}</li>;
        })}
      </ul>
    </div>
  );
};

export default UserSearchCard;
