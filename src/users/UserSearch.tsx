import type { JSX } from "react";
import useUserSearch from "./hooks/useUserSearch";
import UserSearchSkeleton from "./skeletons/UserSearchSkeleton";
import UserSearchCard from "./UserSearchCard";
import "../styles/users/UserSearch.scss";
import { FaSpinner } from "react-icons/fa";

// React component page that allows users to search for other users: includes user search bar to
// search via username, or a checkbox to filter out users who don't share similar interests with
// the current user; shows search results below as cards
const UserSearch = (): JSX.Element => {
  const {
    searchResults,
    searchedUsers,
    showResults,
    searchQuery,
    loadingUsers,
    loadingNewUsernames,
    handleFocus,
    handleBlur,
    handleResults,
    handleChange,
    handleSubmit,
    handleUserCardKeyDown,
    handleUserSearchSuggestionsFocus,
    handleUserSearchSuggestionsBlur,
    handleUserSearchSuggestionsKeyDown,
    handleUserSearchSuggestionsMouseEnter,
    handleUserSearchInputKeyDown,
    handleCheckBoxClick,
  } = useUserSearch();
  return (
    <main id="users-search-page">
      <h1>Search For Friends!</h1>
      <div id="user-search-bar">
        <form onSubmit={handleSubmit}>
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleUserSearchInputKeyDown}
              tabIndex={0}
            />

            <div
              className="search-bar-results"
              hidden={!showResults}
              tabIndex={-1}
              role="listbox"
              onFocus={handleUserSearchSuggestionsFocus}
              onBlur={handleUserSearchSuggestionsBlur}
              onKeyDown={handleUserSearchSuggestionsKeyDown}
              onMouseEnter={handleUserSearchSuggestionsMouseEnter}
            >
              {loadingNewUsernames && (
                <div className="search-result">
                  <FaSpinner id="loading-spinner" />
                </div>
              )}
              {!loadingNewUsernames &&
                searchResults.map((username, i) => {
                  return (
                    <div
                      onClick={handleResults}
                      className={`search-result ${
                        i === searchResults.length - 1 ? "list-bottom" : ""
                      }`}
                      key={`search-res-${username}`}
                      role="option"
                    >
                      {username}
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <label htmlFor="findSimilarInterests">
              Only include users with similar interests
            </label>
            <input
              type="checkbox"
              id="findSimilarInterests"
              name="findSimilarInterests"
              checked={searchQuery.findSimilarInterests}
              onChange={handleChange}
              onKeyDown={handleCheckBoxClick}
            />
          </div>
          <div className="button-div">
            <button className="submit-button">Search</button>
          </div>
        </form>
      </div>

      <div id="search-results">
        {loadingUsers && searchedUsers.length === 0 && (
          <UserSearchSkeleton cards={10} />
        )}
        {!loadingUsers && searchedUsers.length === 0 && (
          <div>
            <h1 id="not-found-message">No users could be found</h1>
          </div>
        )}
        {!loadingUsers &&
          searchedUsers.length > 0 &&
          searchedUsers.map((u) => {
            return (
              <UserSearchCard
                key={`${u.username}-card`}
                user={u}
                handleUserCardKeyDown={handleUserCardKeyDown}
              />
            );
          })}
      </div>
    </main>
  );
};

export default UserSearch;
