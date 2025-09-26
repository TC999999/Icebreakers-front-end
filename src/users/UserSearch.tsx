import { type JSX } from "react";
import { useAppSelector } from "../features/hooks";
import useUserSearch from "./hooks/useUserSearch";
import UserSearchSkeleton from "./skeletons/UserSearchSkeleton";
import UserSearchCard from "./UserSearchCard";
import "../styles/UserSearch.scss";
import { shallowEqual } from "react-redux";

const UserSearch = (): JSX.Element => {
  const { formLoading } = useAppSelector((store) => {
    return store.user.loading.loadingInfo;
  }, shallowEqual);

  const {
    searchResults,
    searchedUsers,
    showResults,
    searchQuery,
    handleSearch,
    handleCheckbox,
    handleResults,
    handleSubmit,
  } = useUserSearch();
  return (
    <main id="users-search-page">
      <h1>Search For Friends!</h1>
      <div id="user-search-bar">
        <form onSubmit={handleSubmit}>
          <div>
            <div id="user-search-bar-input">
              <input
                type="search"
                id="username"
                className={
                  searchResults.length
                    ? "input-bottom-with-results"
                    : "input-bottom-without-results"
                }
                name="username"
                placeholder="Search via username here"
                value={searchQuery.username}
                onChange={handleSearch}
              />
            </div>
            <div
              id="user-search-bar-results"
              className={showResults ? "show-results" : ""}
            >
              {searchResults.map((username, i) => {
                return (
                  <div
                    onClick={handleResults}
                    className={`user-search-result ${
                      i === searchResults.length - 1 ? "list-bottom" : ""
                    }`}
                    key={`search-res-${username}`}
                  >
                    {username}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="findSimilarInterests">
              Search only users with similar interests?
            </label>
            <input
              type="checkbox"
              id="findSimilarInterests"
              name="findSimilarInterests"
              checked={searchQuery.findSimilarInterests}
              onChange={handleCheckbox}
            />
            <button>Search</button>
          </div>
        </form>
      </div>

      <div id="user-search-results">
        {formLoading && <UserSearchSkeleton cards={10} />}
        {!formLoading && !searchedUsers.length && (
          <div>
            <h1 id="not-found-message">No users could be found</h1>
          </div>
        )}
        {!formLoading &&
          searchedUsers.length &&
          searchedUsers.map((u) => {
            return <UserSearchCard key={`${u.username}-card`} user={u} />;
          })}
      </div>
    </main>
  );
};

export default UserSearch;
