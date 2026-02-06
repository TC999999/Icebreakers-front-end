import React from "react";
import type {
  showResults,
  groupName,
  groupSearchParams,
} from "../types/groupTypes";
import "../styles/groups/GroupSearchFilter.scss";

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResults: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleDivFocus: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
  handleDivBlur: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
  showResults: showResults;
  groupSearchResults: groupName[];
  groupSearchParams: groupSearchParams;
  hostSearchResults: string[];
  userSearchResults: string[];
};

const GroupSearchFilter: React.FC<Props> = ({
  handleChange,
  handleResults,
  handleSubmit,
  handleDivFocus,
  handleDivBlur,
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
          <div
            title="title"
            id="group-search-title-div"
            className="input-div"
            onFocus={handleDivFocus}
            onBlur={handleDivBlur}
            tabIndex={0}
          >
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
            className="input-div"
            onFocus={handleDivFocus}
            onBlur={handleDivBlur}
            tabIndex={0}
          >
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
            className="input-div"
            onFocus={handleDivFocus}
            onBlur={handleDivBlur}
            tabIndex={0}
          >
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
          <fieldset>
            <legend>Only Include Groups That: </legend>
            <div>
              <label htmlFor="similarInterests">
                Have Similar Interests To Your Own
              </label>
              <input
                name="similarInterests"
                id="similarInterests"
                type="checkbox"
                checked={groupSearchParams.similarInterests}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="newGroups">You Are Not a Member Of</label>
              <input
                name="newGroups"
                id="newGroups"
                type="checkbox"
                checked={groupSearchParams.newGroups}
                onChange={handleChange}
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
