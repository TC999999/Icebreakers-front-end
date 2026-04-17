import type { showResults, GroupName, GroupSearch } from "../types/groupTypes";
import "../styles/groups/GroupSearchFilter.scss";

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResults: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  handleGroupSearchInputKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handleGroupSearchResultsKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handleGroupSearchResultsFocus: (
    e: React.FocusEvent<HTMLDivElement, Element>,
  ) => void;
  handleGroupSearchResultsBlur: (
    e: React.FocusEvent<HTMLDivElement, Element>,
  ) => void;
  handleGroupSearchResultsMouseOver: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  handleCheckBoxClick: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showResults: showResults;
  groupSearchParams: GroupSearch;
  groupSearchResults: GroupName[];
  loadingGroupSuggestions: boolean;
  hostSearchResults: string[];
  loadingHostSuggestions: boolean;
  userSearchResults: string[];
  loadingUserSuggestions: boolean;
};

const GroupSearchFilter: React.FC<Props> = ({
  handleChange,
  handleResults,
  handleSubmit,
  handleInputBlur,
  handleGroupSearchInputKeyDown,
  handleGroupSearchResultsKeyDown,
  handleGroupSearchResultsFocus,
  handleGroupSearchResultsBlur,
  handleGroupSearchResultsMouseOver,
  handleCheckBoxClick,
  showResults,
  groupSearchResults,
  groupSearchParams,
  hostSearchResults,
  userSearchResults,
}) => {
  return (
    <div id="group-search-box">
      <form onSubmit={handleSubmit}>
        <div id="inputs">
          <div title="title" id="group-search-title-div" className="input-div">
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
              onKeyDown={handleGroupSearchInputKeyDown}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
            <div
              className="search-bar-results"
              id="group-name-search-results"
              role="listbox"
              tabIndex={-1}
              hidden={showResults !== "title"}
              aria-hidden={showResults !== "title"}
              onFocus={handleGroupSearchResultsFocus}
              onBlur={handleGroupSearchResultsBlur}
              onKeyDown={handleGroupSearchResultsKeyDown}
              onMouseEnter={handleGroupSearchResultsMouseOver}
            >
              {groupSearchResults.map((g) => {
                return (
                  <div
                    onClickCapture={handleResults}
                    className="search-result"
                    key={`group-${g.title}-host-${g.host}`}
                    title={g.title}
                    role="option"
                  >
                    {g.title}: <small>Hosted By {g.host}</small>
                  </div>
                );
              })}
            </div>
          </div>
          <div title="host" id="group-host-title-div" className="input-div">
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
              onBlur={handleInputBlur}
              onChange={handleChange}
              onKeyDown={handleGroupSearchInputKeyDown}
              autoComplete="off"
            />
            <div
              className="search-bar-results"
              id="group-host-search-results"
              role="listbox"
              tabIndex={-1}
              hidden={showResults !== "host"}
              aria-hidden={showResults !== "host"}
              onFocus={handleGroupSearchResultsFocus}
              onBlur={handleGroupSearchResultsBlur}
              onKeyDown={handleGroupSearchResultsKeyDown}
              onMouseEnter={handleGroupSearchResultsMouseOver}
            >
              {hostSearchResults.map((h) => {
                return (
                  <div
                    onClickCapture={handleResults}
                    className="search-result"
                    key={`host-${h}`}
                    role="option"
                    title={h}
                  >
                    {h}
                  </div>
                );
              })}
            </div>
          </div>
          <div title="user" id="user-search-title-div" className="input-div">
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
              onBlur={handleInputBlur}
              onChange={handleChange}
              onKeyDown={handleGroupSearchInputKeyDown}
              autoComplete="off"
            />
            <div
              className="search-bar-results"
              id="group-user-search-results"
              role="listbox"
              tabIndex={-1}
              hidden={showResults !== "user"}
              aria-hidden={showResults !== "user"}
              onFocus={handleGroupSearchResultsFocus}
              onBlur={handleGroupSearchResultsBlur}
              onKeyDown={handleGroupSearchResultsKeyDown}
              onMouseEnter={handleGroupSearchResultsMouseOver}
            >
              {userSearchResults.map((u) => {
                return (
                  <div
                    onClickCapture={handleResults}
                    className="search-result"
                    key={`user-${u}`}
                    title={u}
                    role="option"
                  >
                    {u}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div id="search-footer">
          <fieldset role="group">
            <legend>Only Include Groups That: </legend>
            <div>
              <label htmlFor="similarInterests">
                Have Similar Interests To Your Own
              </label>
              <input
                name="similarInterests"
                id="similarInterests"
                type="checkbox"
                role="checkbox"
                checked={groupSearchParams.similarInterests}
                onChange={handleChange}
                onKeyDown={handleCheckBoxClick}
              />
            </div>
            <div>
              <label htmlFor="newGroups">You Are Not a Member Of</label>
              <input
                name="newGroups"
                id="newGroups"
                type="checkbox"
                role="checkbox"
                checked={groupSearchParams.newGroups}
                onChange={handleChange}
                onKeyDown={handleCheckBoxClick}
              />
            </div>
          </fieldset>
          <div className="form-div">
            <button type="submit" className="submit-button">
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GroupSearchFilter;
