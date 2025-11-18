import { type JSX } from "react";
import { useAppSelector } from "../features/hooks";
import useUserSearch from "./hooks/useUserSearch";
import UserSearchSkeleton from "./skeletons/UserSearchSkeleton";
import UserSearchCard from "./UserSearchCard";
import "../styles/users/UserSearch.scss";
import { shallowEqual } from "react-redux";

// React component page that allows users to search for other users: includes user search bar to
// search via username, or a checkbox to filter out users who don't share similar interests with
// the current user; shows search results below as cards
const UserSearch = (): JSX.Element => {
  const { formLoading } = useAppSelector((store) => {
    return store.user.loading.loadingInfo;
  }, shallowEqual);

  const {
    searchResults,
    searchedUsers,
    showResults,
    searchQuery,
    handleFocus,
    handleBlur,
    handleResults,
    handleChange,
    handleSubmit,
  } = useUserSearch();
  return (
    <main id="users-search-page">
      <h1>Search For Friends!</h1>
      <div id="user-search-bar">
        <form onSubmit={handleSubmit}>
          <div onFocus={handleFocus} onBlur={handleBlur} tabIndex={0}>
            <div id="user-search-bar-input">
              <input
                type="search"
                id="username"
                className={
                  searchResults.length > 0 && showResults
                    ? "input-bottom-with-results"
                    : "input-bottom-without-results"
                }
                name="username"
                placeholder="Search via username here"
                value={searchQuery.username}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div
              className={`search-bar-results ${
                searchResults.length > 0 && showResults ? "show-results" : ""
              }`}
              hidden={!showResults}
            >
              {searchResults.map((username, i) => {
                return (
                  <div
                    onClick={handleResults}
                    className={`search-result ${
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
              onChange={handleChange}
            />
            <button>Search</button>
          </div>
        </form>
      </div>

      <div id="search-results">
        {formLoading && <UserSearchSkeleton cards={10} />}
        {!formLoading && searchedUsers.length === 0 && (
          <div>
            <h1 id="not-found-message">No users could be found</h1>
          </div>
        )}
        {!formLoading &&
          searchedUsers.length > 0 &&
          searchedUsers.map((u) => {
            return <UserSearchCard key={`${u.username}-card`} user={u} />;
          })}
      </div>
    </main>
  );
};

export default UserSearch;
