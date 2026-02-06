import { lazy, Suspense } from "react";
import useGroupSearchPage from "./hooks/useGroupSearchPage";
import GroupSearchCard from "./GroupSearchCard";
import GroupSearchSkeleton from "./skeletons/GroupSearchSkeleton";
import "../styles/groups/GroupSearchPage.scss";
import { useAppSelector } from "../features/hooks";
import GroupSearchFilter from "./GroupSearchFilter";
const GroupSearchFilterTablet = lazy(() => import("./GroupSearchFilterTablet"));
import LoadingSmall from "../LoadingSmall";
import { shallowEqual } from "react-redux";
import { CiFilter } from "react-icons/ci";

// React component that allows user to search for groups: includes search bars for group names,
// users that host the group, and users who are members of groups; also includes checkboxes to filter
// out groups that share no similar interests with the user, and groups that the user is already a
// member of
const GroupSearchPage = () => {
  const loading = useAppSelector(
    (store) => store.user.loading.loadingInfo.formLoading,
    shallowEqual,
  );

  const {
    currentGroups,
    groupSearchParams,
    groupSearchResults,
    hostSearchResults,
    userSearchResults,
    showResults,
    showGroupFilterTablet,
    handleChange,
    handleResults,
    handleDivFocus,
    handleDivBlur,
    handleSubmit,
    toggleShowTabletGroupFilter,
  } = useGroupSearchPage();

  return (
    <main id="group-search-page">
      {showGroupFilterTablet && (
        <Suspense fallback={<LoadingSmall lazy={true} />}>
          <GroupSearchFilterTablet
            handleChange={handleChange}
            handleResults={handleResults}
            handleSubmit={handleSubmit}
            handleDivFocus={handleDivFocus}
            handleDivBlur={handleDivBlur}
            toggleShowTabletGroupFilter={toggleShowTabletGroupFilter}
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
        >
          <CiFilter />
          Filter Results
        </button>

        <GroupSearchFilter
          handleChange={handleChange}
          handleResults={handleResults}
          handleSubmit={handleSubmit}
          handleDivFocus={handleDivFocus}
          handleDivBlur={handleDivBlur}
          showResults={showResults}
          groupSearchResults={groupSearchResults}
          groupSearchParams={groupSearchParams}
          hostSearchResults={hostSearchResults}
          userSearchResults={userSearchResults}
        />
      </header>
      <div id="group-search-list">
        <div id="search-results">
          {loading && <GroupSearchSkeleton cards={10} />}
          {!loading && currentGroups.length > 0 && (
            <>
              {currentGroups.map((group) => (
                <GroupSearchCard
                  key={`group-${group.id}`}
                  id={group.id}
                  title={group.title}
                  host={group.host}
                  interests={group.interests}
                  users={group.users}
                />
              ))}
            </>
          )}
          {!loading && currentGroups.length === 0 && (
            <h2 id="empty-list">There Are No Groups That Match Your Query</h2>
          )}
        </div>
      </div>
    </main>
  );
};

export default GroupSearchPage;
