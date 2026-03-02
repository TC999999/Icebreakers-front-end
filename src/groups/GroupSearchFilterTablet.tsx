import type {
  showResults,
  groupName,
  groupSearchParams,
} from "../types/groupTypes";
import GroupSearchFilter from "./GroupSearchFilter";
import "../styles/groups/GroupSearchFilter.scss";
import "../styles/groups/GroupSearchFilterTablet.scss";

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResults: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  handleGroupSearchResultsKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handleGroupSearchInputKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handleGroupSearchResultsFocus: (
    e: React.FocusEvent<HTMLDivElement, Element>,
  ) => void;
  handleGroupSearchResultsBlur: (
    e: React.FocusEvent<HTMLDivElement, Element>,
  ) => void;
  toggleShowTabletGroupFilter: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleGroupSearchResultsMouseOver: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  handleCheckBoxClick: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showResults: showResults;
  groupSearchResults: groupName[];
  groupSearchParams: groupSearchParams;
  hostSearchResults: string[];
  userSearchResults: string[];
};

const GroupSearchFilterTablet: React.FC<Props> = ({
  handleChange,
  handleResults,
  handleSubmit,
  handleInputBlur,
  toggleShowTabletGroupFilter,
  handleGroupSearchResultsKeyDown,
  handleGroupSearchInputKeyDown,
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
    <div className="modal-transparent" id="group-search-filter-tablet">
      <div className="modal-filter-content">
        <div id="cancel-button-div">
          <button
            type="button"
            aria-label="Cancel Filter and Go Back"
            className="cancel-button"
            onClick={(e) => toggleShowTabletGroupFilter(e)}
          >
            Cancel
          </button>
        </div>

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
      </div>
    </div>
  );
};

export default GroupSearchFilterTablet;
