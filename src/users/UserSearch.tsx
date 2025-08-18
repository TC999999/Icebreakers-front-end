import { type JSX } from "react";
import useUserSearch from "./hooks/useUserSearch";
import UserSearchCard from "./UserSearchCard";

const UserSearch = (): JSX.Element => {
  const { searchedUsers } = useUserSearch();
  return (
    <main id="users-search-page">
      UserSearch
      <div id="user-search-bar"></div>
      <div id="user-search-results">
        {searchedUsers.map((u) => {
          return <UserSearchCard key={`${u.username}-card`} user={u} />;
        })}
      </div>
    </main>
  );
};

export default UserSearch;
