import { type JSX } from "react";
import useUserSearch from "./hooks/useUserSearch";
import UserSearchCard from "./UserSearchCard";
import "../styles/UserSearch.scss";

const UserSearch = (): JSX.Element => {
  const { searchedUsers } = useUserSearch();
  return (
    <main id="users-search-page">
      <h1>Search For Friends!</h1>
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
