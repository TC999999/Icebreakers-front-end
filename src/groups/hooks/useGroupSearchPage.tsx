import { useEffect, useState, useCallback } from "react";
import type { showResults, GroupSearch } from "../../types/groupTypes";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import userAPI from "../../apis/userAPI";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/loading";
import {
  useSearchParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../appHooks/useDebounce";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";

type keyPress = { [key: string]: boolean };

// custom hook for page for retrieving a list of groups filtered by inputted parameters
const useGroupSearchPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get("title") || "";
  const host = searchParams.get("host") || "";
  const user = searchParams.get("user") || "";
  const similarInterests = searchParams.has("similarInterests");
  const newGroups = searchParams.has("newGroups");

  // initial url search parameter values are also initial group search params. Ensures that
  // the search query boxes/checkboxes are filled on initial render
  const [groupSearchParams, setGroupSearchParams] = useState<GroupSearch>({
    title,
    host,
    user,
    similarInterests,
    newGroups,
  });

  const [showResults, setShowResults] = useState<showResults>("");
  const [showGroupFilterTablet, setShowGroupFilterTablet] =
    useState<boolean>(false);

  const keyDown: keyPress = {};

  const { handleSubmitRequestError } = useRequestErrorHandler();

  // on initial render, grabs search params values from url and retrieves filtered list
  // of all groups based on those parameters;
  const { data: groups, isFetching: loadingGroups } = useQuery({
    queryFn: () =>
      groupConversationsAPI.searchGroups({
        title: title.length > 0 ? title : null,
        host: host.length > 0 ? host : null,
        user: user.length > 0 ? user : null,
        similarInterests: similarInterests || null,
        newGroups: newGroups || null,
      }),
    queryKey: ["groups", { title, host, user, similarInterests, newGroups }],
    initialData: [],
    retry: 0,
  });

  // debounced search input for group suggestion list to prevent unneeded refetches
  // from server side
  const { newSearchInput: groupSuggestionInput } = useDebounce(
    groupSearchParams.title,
  );

  // debounced search input for host user suggestion list to prevent unneeded refetches
  // from server side
  const { newSearchInput: hostSuggestionInput } = useDebounce(
    groupSearchParams.host,
  );

  // debounced search input for user suggestion list to prevent unneeded refetches
  // from server side
  const { newSearchInput: userSuggestionInput } = useDebounce(
    groupSearchParams.user,
  );

  // query for list of group name suggestions; updates automatically when debounced group
  // suggestion input value updates
  const { data: groupSearchSuggestions, isFetching: loadingGroupSuggestions } =
    useQuery({
      queryFn: () =>
        groupConversationsAPI.getAllGroupNames(groupSuggestionInput),
      queryKey: ["groupSuggestions", { name: groupSuggestionInput }],
      initialData: [],
      retry: 0,
      enabled: groupSuggestionInput.length > 0,
    });

  // query for list of host name suggestions; updates automatically when debounced host
  // suggestion input value updates
  const { data: hostSearchSuggestions, isFetching: loadingHostSuggestions } =
    useQuery({
      queryFn: () => userAPI.getUserSuggestions(hostSuggestionInput),
      queryKey: ["hostSuggestions", { name: hostSuggestionInput }],
      initialData: [],
      retry: 0,
      enabled: hostSuggestionInput.length > 0,
    });

  // query for list of user name suggestions; updates automatically when debounced user
  // suggestion input value updates
  const { data: userSearchSuggestions, isFetching: loadingUserSuggestions } =
    useQuery({
      queryFn: () => userAPI.getUserSuggestions(userSuggestionInput),
      queryKey: ["userSuggestions", { name: userSuggestionInput }],
      initialData: [],
      retry: 0,
      enabled: userSuggestionInput.length > 0,
    });

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

  // when user unfocuses their cursor on a search query input div, hides dropdown search
  // query options for that respective input
  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLDivElement>) => {
      e.preventDefault();
      if (
        !(
          e.relatedTarget?.role === "listbox" ||
          e.relatedTarget?.role === "option"
        )
      ) {
        setShowResults("");
      }
    },
    [showResults],
  );

  // when the list of search result suggestions is focused on by the keyboard, the first
  // suggestion is automatically selected and the list is automatically scrolled to the top
  const handleGroupSearchResultsFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.scroll({ top: 0, behavior: "smooth" });

      const firstResult = e.currentTarget.querySelector(
        "div[role='option']",
      ) as HTMLDivElement;

      if (firstResult) firstResult.classList.add("selected");
    },
    [],
  );

  // when the list of search result suggestions loses keyboard focus, unless the new focused
  // element is the respective search input, hides the list of search result suggestions
  const handleGroupSearchResultsBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.scroll({ top: 0, behavior: "smooth" });

      if (
        !(
          e.relatedTarget?.role === "listbox" ||
          e.relatedTarget?.role === "option" ||
          (e.relatedTarget?.tagName === "INPUT" &&
            showResults === e.relatedTarget?.getAttribute("name"))
        )
      ) {
        const selectedTarget = e.currentTarget.querySelector(
          "div.selected[role='option']",
        );

        if (selectedTarget) selectedTarget.classList.remove("selected");

        setShowResults("");
      }
    },
    [showResults],
  );

  // toggle state that shows group filter window at smaller screen sizes when filter button
  // is pressed
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
      const s = e.currentTarget.title;
      setGroupSearchParams((prev) => ({
        ...prev,
        [showResults]: s,
      }));

      setShowResults("");
    },
    [showResults, groupSearchParams],
  );

  // changes group name/username search query value in group params state when value in any search
  // query input or checkbox checked attribute changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;

      if (
        (name === "title" || name === "host" || name === "user") &&
        !showResults
      )
        setShowResults(name);

      const results = e.currentTarget.nextElementSibling as HTMLDivElement;
      if (results && results.scrollTop !== 0) {
        results.scroll({ top: 0 });
      }

      setGroupSearchParams((prev) => ({
        ...prev,
        [name]: type === "search" ? value : checked,
      }));
    },
    [groupSearchParams, showResults],
  );

  // updates params in url which causes refetch of group cards
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
        setSearchParams((prev) => ({ ...prev, ...newParams }));
        if (showGroupFilterTablet) setShowGroupFilterTablet(false);
      } catch (err) {
        handleSubmitRequestError(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [groupSearchParams],
  );

  // A11Y Friendly Functions
  // keyboard friendly function: when a group search card is focused on using
  // the tab key, if the user presses the enter key when also focused a card;
  // the browser redirects them to the correct group page based on the id;
  // additionally, if the user pressed either the u or i key and either the
  // left or right key at the same time, the user or interest list scrolls up
  // or down respectively
  const handleGroupSearchCardKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      if (e.key !== "Tab") e.preventDefault();
      if (
        (e.key === "u" ||
          e.key === "i" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight") &&
        !keyDown[e.key] &&
        Object.keys(keyDown).length < 2
      )
        keyDown[e.key] = true;

      if (e.key === "Enter") {
        navigate(`/groups/${id}`);
      } else if (
        (keyDown.u || keyDown.i) &&
        (keyDown.ArrowLeft || keyDown.ArrowRight)
      ) {
        const list = e.currentTarget.querySelector<HTMLUListElement>(
          `.${keyDown.u ? "user" : "interest"}-list ul`,
        );
        if (list) {
          const currScroll = list.scrollTop;
          const newScroll = keyDown.ArrowRight
            ? currScroll + 20
            : currScroll - 20;
          list.scrollTo({ top: newScroll, behavior: "smooth" });
        }
      }
    },
    [],
  );

  // when a key is released when focused on a group card, removes the key from
  // the key down object
  const handleGroupSearchCardKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyDown[e.key]) delete keyDown[e.key];
    },
    [],
  );

  // keyboard friendly input handler: when pressing down when focused on a search input,
  // if a list of search results are present below the input, the keyboard focuses on that list
  // instead
  const handleGroupSearchInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const results = e.currentTarget.nextElementSibling as HTMLDivElement;

        const resultsAreShown =
          results.querySelectorAll("div[role='option']").length > 0;

        if (resultsAreShown) {
          results.focus();
          e.currentTarget.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [hostSearchSuggestions, userSearchSuggestions, groupSearchSuggestions],
  );

  // keyboard friendly search result suggestion handler: when either up or down arrow keys are pressed
  // when search result suggestion box is focused on by keyboard, list scrolls up or down respectively
  // and selects next item in list by adding selected class to element; if enter key is pressed when
  // on a selected list item, fills correct search input with value in list item and hides list; if
  // escape key is pressed, returns to focus on correct search input; if at the top of the list and
  // up arrow key is pressed, focuses on correct search input instead; if there is no selected target
  // and down arrow key is pressed, scrolls to top of list and selects first item
  const handleGroupSearchResultsKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const selectedTarget = e.currentTarget.querySelector(
        "div.selected[role='option']",
      ) as HTMLDivElement;

      const previousInput = e.currentTarget
        .previousElementSibling as HTMLInputElement;

      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && selectedTarget) {
        const nextItem =
          e.key === "ArrowDown"
            ? (selectedTarget.nextElementSibling as HTMLDivElement)
            : (selectedTarget.previousElementSibling as HTMLDivElement);

        const currScroll = e.currentTarget.scrollTop;
        const newScroll =
          e.key === "ArrowDown" ? currScroll + 20 : currScroll - 20;
        e.currentTarget.scrollTo({ top: newScroll, behavior: "smooth" });

        if (nextItem) {
          nextItem?.classList.add("selected");
          selectedTarget.classList.remove("selected");
        } else if (!nextItem && e.key === "ArrowUp") {
          previousInput.focus();
          selectedTarget.classList.remove("selected");
        }
      } else if (e.key === "Enter" && selectedTarget) {
        selectedTarget.click();
      } else if (e.key === "Escape" && selectedTarget) {
        previousInput.focus();
        selectedTarget.classList.remove("selected");
      } else if (!selectedTarget && e.key === "ArrowDown") {
        const newTarget = e.currentTarget.querySelector(
          "div[role='option']",
        ) as HTMLDivElement;

        if (newTarget) newTarget.classList.add("selected");
        e.currentTarget.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [],
  );

  // when hovering over list of search suggestions with an item already selected,
  // removes the selected class from that item
  const handleGroupSearchResultsMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const selectedTarget = e.currentTarget.querySelector(
        "div.selected[role='option']",
      );
      if (selectedTarget) {
        selectedTarget.classList.remove("selected");
      }
    },
    [],
  );

  const handleCheckBoxClick = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.click();
      }
    },
    [groupSearchParams],
  );

  return {
    groups,
    groupSearchParams,
    groupSearchSuggestions,
    hostSearchSuggestions,
    userSearchSuggestions,
    showResults,
    showGroupFilterTablet,
    loadingGroups,
    loadingGroupSuggestions,
    loadingHostSuggestions,
    loadingUserSuggestions,
    handleChange,
    handleInputBlur,
    handleResults,
    handleSubmit,
    toggleShowTabletGroupFilter,
    handleGroupSearchCardKeyDown,
    handleGroupSearchCardKeyUp,
    handleGroupSearchInputKeyDown,
    handleGroupSearchResultsFocus,
    handleGroupSearchResultsBlur,
    handleGroupSearchResultsKeyDown,
    handleGroupSearchResultsMouseOver,
    handleCheckBoxClick,
  };
};

export default useGroupSearchPage;
