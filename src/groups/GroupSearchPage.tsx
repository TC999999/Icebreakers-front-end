import useGroupSearchPage from "./hooks/useGroupSearchPage";
import GroupSearchCard from "./GroupSearchCard";
import "../styles/groups/GroupSearchPage.scss";

const GroupSearchPage = () => {
  const {
    currentGroups,
    groupSearchParams,
    groupSearchResults,
    hostSearchResults,
    userSearchResults,
    showResults,
    handleChange,
    handleResults,
    handleDivFocus,
    handleDivBlur,
    handleSubmit,
  } = useGroupSearchPage();

  return (
    <main id="group-search-page">
      <header>
        <h1>Search for Groups Here</h1>

        <div id="group-search-box">
          <form onSubmit={handleSubmit}>
            <div id="inputs">
              <div
                title="title"
                id="group-search-title-div"
                className="input-div form-div"
                onFocus={handleDivFocus}
                onBlur={handleDivBlur}
                tabIndex={0}
              >
                <label htmlFor="title">Search By Group Names</label>
                <input
                  className={
                    showResults === "title" && groupSearchResults.length > 0
                      ? "input-bottom-with-results"
                      : "input-bottom-without-results"
                  }
                  name="title"
                  id="title"
                  placeholder="Search for group names here"
                  type="search"
                  value={groupSearchParams.title}
                  onChange={handleChange}
                />
                <div
                  className={`search-bar-results ${
                    showResults === "title" ? "show-results" : ""
                  }`}
                  id="group-name-search-results"
                  hidden={showResults !== "title"}
                >
                  {groupSearchResults.map((g) => {
                    return (
                      <div
                        onClickCapture={handleResults}
                        className="search-result"
                        key={`group-${g.title}-host-${g.host}`}
                        title={g.title}
                      >
                        {g.title}: <small>Hosted By {g.host}</small>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                title="host"
                id="group-host-title-div"
                className="input-div form-div"
                onFocus={handleDivFocus}
                onBlur={handleDivBlur}
                tabIndex={0}
              >
                <label htmlFor="host">Search By Group Hosts</label>
                <input
                  className={
                    showResults === "host" && hostSearchResults.length > 0
                      ? "input-bottom-with-results"
                      : "input-bottom-without-results"
                  }
                  name="host"
                  id="host"
                  placeholder="Search for group hosts here"
                  type="search"
                  value={groupSearchParams.host}
                  onChange={handleChange}
                />
                <div
                  className={`search-bar-results ${
                    showResults === "host" ? "show-results" : ""
                  }`}
                  id="group-host-search-results"
                  hidden={showResults !== "host"}
                >
                  {hostSearchResults.map((h) => {
                    return (
                      <div
                        onClickCapture={handleResults}
                        className="search-result"
                        key={`host-${h}`}
                        title={h}
                      >
                        {h}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                title="user"
                id="user-search-title-div"
                className="input-div form-div"
                onFocus={handleDivFocus}
                onBlur={handleDivBlur}
                tabIndex={0}
              >
                <label htmlFor="user">Search By Group Members</label>
                <input
                  className={
                    showResults === "user" && userSearchResults.length > 0
                      ? "input-bottom-with-results"
                      : "input-bottom-without-results"
                  }
                  name="user"
                  id="user"
                  placeholder="Search for group members here"
                  type="search"
                  value={groupSearchParams.user}
                  onChange={handleChange}
                />
                <div
                  className={`search-bar-results ${
                    showResults === "user" ? "show-results" : ""
                  }`}
                  id="group-user-search-results"
                  hidden={showResults !== "user"}
                >
                  {userSearchResults.map((u) => {
                    return (
                      <div
                        onClickCapture={handleResults}
                        className="search-result"
                        key={`user-${u}`}
                        title={u}
                      >
                        {u}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div id="search-footer">
              <div>
                <label htmlFor="similarInterests">
                  Only include groups with similar interests to your own
                </label>
                <input
                  name="similarInterests"
                  id="similarInterests"
                  type="checkbox"
                  checked={groupSearchParams.similarInterests}
                  onChange={handleChange}
                />
                <div
                  className="search-bar-results"
                  id="user-search-results"
                ></div>
              </div>
              <div>
                <label htmlFor="newGroups">
                  Only include groups that you are not a member of
                </label>
                <input
                  name="newGroups"
                  id="newGroups"
                  type="checkbox"
                  checked={groupSearchParams.newGroups}
                  onChange={handleChange}
                />
                <div
                  className="search-bar-results"
                  id="user-search-results"
                ></div>
              </div>
              <div className="form-div">
                <button type="submit" className="submit-button">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </header>

      <div id="group-search-list">
        <h1>Search Results</h1>

        {currentGroups.length > 0 ? (
          <div id="search-results">
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
          </div>
        ) : (
          <div>
            <h2 id="empty-list">There Are No Groups That Match Your Query</h2>
          </div>
        )}
      </div>
    </main>
  );
};

export default GroupSearchPage;
