import { lazy, Suspense } from "react";
import useGroupSearchPage from "./hooks/useGroupSearchPage";
import GroupSearchCard from "./GroupSearchCard";
import GroupSearchSkeleton from "./skeletons/GroupSearchSkeleton";
import "../styles/groups/GroupSearchPage.scss";
import GroupSearchFilter from "./GroupSearchFilter";
const GroupSearchFilterTablet = lazy(() => import("./GroupSearchFilterTablet"));
import LoadingSmall from "../LoadingSmall";
import { CiFilter } from "react-icons/ci";

// React component that allows user to search for groups: includes search bars for group names,
// users that host the group, and users who are members of groups; also includes checkboxes to filter
// out groups that share no similar interests with the user, and groups that the user is already a
// member of
const GroupSearchPage = () => {
  const {
    currentGroups,
    groupSearchParams,
    groupSearchResults,
    hostSearchResults,
    userSearchResults,
    showResults,
    showGroupFilterTablet,
    initialMountComplete,
    handleChange,
    handleResults,
    handleInputBlur,
    handleSubmit,
    toggleShowTabletGroupFilter,
    handleGroupSearchCardKeyDown,
    handleGroupSearchCardKeyUp,
    handleGroupSearchResultsKeyDown,
    handleGroupSearchInputKeyDown,
    handleGroupSearchResultsFocus,
    handleGroupSearchResultsBlur,
    handleGroupSearchResultsMouseOver,
    handleCheckBoxClick,
  } = useGroupSearchPage();

  return (
    <main id="group-search-page">
      {showGroupFilterTablet && (
        <Suspense fallback={<LoadingSmall lazy={true} />}>
          <GroupSearchFilterTablet
            handleChange={handleChange}
            handleResults={handleResults}
            handleSubmit={handleSubmit}
            handleInputBlur={handleInputBlur}
            toggleShowTabletGroupFilter={toggleShowTabletGroupFilter}
            handleGroupSearchResultsKeyDown={handleGroupSearchResultsKeyDown}
            handleGroupSearchInputKeyDown={handleGroupSearchInputKeyDown}
            handleGroupSearchResultsFocus={handleGroupSearchResultsFocus}
            handleGroupSearchResultsBlur={handleGroupSearchResultsBlur}
            handleGroupSearchResultsMouseOver={
              handleGroupSearchResultsMouseOver
            }
            handleCheckBoxClick={handleCheckBoxClick}
            showResults={showResults}
            groupSearchResults={groupSearchResults}
            groupSearchParams={groupSearchParams}
            hostSearchResults={hostSearchResults}
            userSearchResults={userSearchResults}
          />
        </Suspense>
      )}
      <header>
        <h1>Search for Groups Here</h1>

        <button
          id="filter-groups-on-tablet"
          className="submit-button"
          onClick={(e) => toggleShowTabletGroupFilter(e)}
          aria-label="Filter Results"
        >
          <CiFilter />
        </button>

        <GroupSearchFilter
          handleChange={handleChange}
          handleResults={handleResults}
          handleSubmit={handleSubmit}
          handleInputBlur={handleInputBlur}
          handleGroupSearchResultsKeyDown={handleGroupSearchResultsKeyDown}
          handleGroupSearchInputKeyDown={handleGroupSearchInputKeyDown}
          handleGroupSearchResultsFocus={handleGroupSearchResultsFocus}
          handleGroupSearchResultsBlur={handleGroupSearchResultsBlur}
          handleGroupSearchResultsMouseOver={handleGroupSearchResultsMouseOver}
          handleCheckBoxClick={handleCheckBoxClick}
          showResults={showResults}
          groupSearchResults={groupSearchResults}
          groupSearchParams={groupSearchParams}
          hostSearchResults={hostSearchResults}
          userSearchResults={userSearchResults}
        />
      </header>
      <div id="group-search-list" role="Group Search List">
        <div id="search-results" role="Group Search Results">
          {!initialMountComplete.current && currentGroups.length === 0 && (
            <GroupSearchSkeleton cards={10} />
          )}
          {initialMountComplete.current && currentGroups.length > 0 && (
            <>
              {currentGroups.map((group) => (
                <GroupSearchCard
                  key={`group-${group.id}`}
                  id={group.id}
                  title={group.title}
                  host={group.host}
                  interests={group.interests}
                  users={group.users}
                  handleGroupSearchCardKeyDown={handleGroupSearchCardKeyDown}
                  handleGroupSearchCardKeyUp={handleGroupSearchCardKeyUp}
                />
              ))}
            </>
          )}
          {initialMountComplete.current && currentGroups.length === 0 && (
            <h2 id="empty-list">There Are No Groups That Match Your Query</h2>
          )}
        </div>
      </div>
    </main>
  );
};

export default GroupSearchPage;
