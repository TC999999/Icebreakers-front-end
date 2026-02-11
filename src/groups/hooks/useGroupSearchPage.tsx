import { useEffect, useState, useRef, useCallback } from "react";
import type {
  groupSearchCard,
  groupSearchParams,
  groupName,
  showResults,
} from "../../types/groupTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import userAPI from "../../apis/userAPI";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading, setLoadError } from "../../features/slices/loading";
import {
  useSearchParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";

const useGroupSearchPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [groupSearchParams, setGroupSearchParams] = useState<groupSearchParams>(
    {
      title: "",
      host: "",
      user: "",
      similarInterests: false,
      newGroups: false,
    },
  );
  const originalGroups = useRef<groupName[]>([]);
  const [showResults, setShowResults] = useState<showResults>("");
  const [groupSearchResults, setGroupSearchResults] = useState<groupName[]>([]);
  const initialUsers = useRef<string[]>([]);
  const [hostSearchResults, setHostSearchResults] = useState<string[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<groupSearchCard[]>([]);
  const [showGroupFilterTablet, setShowGroupFilterTablet] =
    useState<boolean>(false);
  const initialMountComplete = useRef<boolean>(false);

  // on initial render, grabs search params values from url, sets those parameter values into
  // the search query boxes, and retrieves filtered list of all groups based on those parameters;
  // furthermore, retrieves a list of all group names and usernames for search query purposes
  useEffect(() => {
    const getAllGroups = async () => {
      try {
        dispatch(setFormLoading(true));
        let params = Object.fromEntries(searchParams.entries());
        setGroupSearchParams((prev) => ({
          ...prev,
          ...params,
          similarInterests: params.similarInterests === "true",
          newGroups: params.newGroups === "true",
        }));
        const groups = await groupConversationsAPI.searchGroups(params);
        const groupNames = await groupConversationsAPI.getAllGroupNames();
        originalGroups.current = groupNames;
        const allUsernames = await userAPI.getUserNames();
        initialUsers.current = allUsernames;
        setCurrentGroups(groups);
        setGroupSearchResults(groupNames);
        setHostSearchResults(allUsernames);
        setUserSearchResults(allUsernames);
      } catch (err: any) {
        const error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      } finally {
        dispatch(setFormLoading(false));
        initialMountComplete.current = true;
      }
    };
    getAllGroups();
  }, []);

  // if hidden conversation tab list is shown on smaller screen, automatically hides tab list if
  // screen width is wider than 1173px
  useEffect(() => {
    const handleResize = () => {
      if (showGroupFilterTablet && window.innerWidth > 1000) {
        setShowGroupFilterTablet(false);
      }
    };
    window.addEventListener("resize", handleResize);
  }, [showGroupFilterTablet]);

  // when the group name search query value changes, filters list of group names with names that
  // begins with the query value and sets the filtered list in state
  const handleGroupSearchResults = (value: string) => {
    setGroupSearchResults(
      originalGroups.current.filter((g) => {
        return g.title.startsWith(value);
      }),
    );
  };

  // when either the host user or member user search query value changes, filters list
  // of usernames with names that begins with query value and sets the filtered list in
  // the respective state
  const handleUserSearchResults = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter(
      initialUsers.current.filter((u) => {
        return u.startsWith(value);
      }),
    );
  };

  // when user focues their curson on a search query input div, shows dropdown search query
  // options for that respective input
  const handleDivFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      let s = e.currentTarget.title;
      if (s === "title" || s === "host" || s === "user") {
        setShowResults(s);
      }
    },
    [showResults],
  );

  // when user unfocuses their curson on a search query input div, hides dropdown search
  // query options for that respective input
  const handleDivBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      e.preventDefault();
      setShowResults("");
    },
    [showResults],
  );

  const toggleShowTabletGroupFilter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();

      setShowGroupFilterTablet(!showGroupFilterTablet);
    },
    [showGroupFilterTablet],
  );

  // when user clicks on one of the group name/username options from dropdown below search input,
  // sets value in search params state
  const handleResults = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      let s = e.currentTarget.title;
      setGroupSearchParams((prev) => ({
        ...prev,
        [showResults]: s,
      }));

      switch (showResults) {
        case "title":
          handleGroupSearchResults(s);
          break;
        case "host":
          handleUserSearchResults(setHostSearchResults, s);
          break;
        case "user":
          handleUserSearchResults(setUserSearchResults, s);
          break;
      }

      setShowResults("");
    },
    [showResults, groupSearchParams],
  );

  // changes group name/username search query value in group params state when value in any search
  // query input or checkbox checked attribute changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;
      switch (name) {
        case "title":
          value ? handleGroupSearchResults(value) : setGroupSearchResults([]);
          break;
        case "host":
          value
            ? handleUserSearchResults(setHostSearchResults, value)
            : setHostSearchResults([]);
          break;
        case "user":
          value
            ? handleUserSearchResults(setUserSearchResults, value)
            : setUserSearchResults([]);
          break;
      }
      setGroupSearchParams((prev) => ({
        ...prev,
        [name]: type === "search" ? value : checked,
      }));
    },
    [groupSearchParams],
  );

  // sends params to backend to retrieve filtered group list from database, which is then set in
  // state; additionally, sets search params in the url search query
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        dispatch(setFormLoading(true));
        let newParams = Object.fromEntries(
          Object.entries(groupSearchParams).filter((p) => {
            return p[1];
          }),
        );
        const groups = await groupConversationsAPI.searchGroups(newParams);
        setCurrentGroups(groups);
        setSearchParams((prev) => ({ ...prev, ...newParams }));
        if (showGroupFilterTablet) setShowGroupFilterTablet(false);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [groupSearchParams],
  );

  return {
    currentGroups,
    groupSearchParams,
    groupSearchResults,
    hostSearchResults,
    userSearchResults,
    showResults,
    showGroupFilterTablet,
    initialMountComplete,
    handleChange,
    handleDivFocus,
    handleDivBlur,
    handleResults,
    handleSubmit,
    toggleShowTabletGroupFilter,
  };
};

export default useGroupSearchPage;
