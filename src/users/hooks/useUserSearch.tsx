import { useState, useCallback } from "react";
import { type UserSearch } from "../../types/userTypes";
import {
  useSearchParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { setFormLoading } from "../../features/slices/loading";
import { type AppDispatch } from "../../features/store";
import userAPI from "../../apis/userAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useLoading from "../../appHooks/useLoading";
import useDebounce from "../../appHooks/useDebounce";

// custom hook to handle user search page logic
const useUserSearch = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (message: string) => toast.error(message);
  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get("username") || "";
  const findSimilarInterests = searchParams.has("findSimilarInterests");
  const [showResults, setShowResults] = useState<boolean>(false);

  const initialQuery: UserSearch = {
    username: "",
    findSimilarInterests: false,
  };

  const [searchQuery, setSearchQuery] = useState<UserSearch>(initialQuery);

  // on initial render, gets user search parameters from url query string, retrieves a filtered
  // list of usernames based on those parameters and sets them in state; additionally, the parameter
  // values are set into the search bar input value state
  const { data: searchedUsers, isFetching: loadingUsers } = useQuery({
    queryKey: ["users", { username, findSimilarInterests }],
    queryFn: () =>
      userAPI.searchForUsers({
        username: username.length > 0 ? username : null,
        findSimilarInterests: findSimilarInterests || null,
      }),
    initialData: [],
    retry: 0,
  });

  // custom loading hook; when use query is fetching new data, this hook shows the custom
  // loading screen and hides it when data is no longer loading
  useLoading({ isFetching: loadingUsers });

  // debounce hook: waits for user to stop typing before updating search input value and refetching
  // data
  const { newSearchInput } = useDebounce(searchQuery.username);

  // fetches a new list of usernames from the api whenever the search term from the above debounce
  // hook is updated; if search term is an empty string, disables refetch
  const { data: searchResults, isFetching: loadingNewUsernames } = useQuery({
    queryKey: ["usernames", { filter: newSearchInput }],
    queryFn: () => userAPI.getUserSuggestions(newSearchInput),
    initialData: [],
    enabled: newSearchInput.length > 0,
    retry: 0,
  });

  // when the user focuses their cursor on the search bar, automatically shows the current list of
  // filtered users based on the current search input value in the search dropdown
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowResults(true);
  }, []);

  // when the user stops focusing on the search bar, automatically hides the search dropdown list
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.relatedTarget?.className !== "search-bar-results")
      setShowResults(false);
  }, []);

  // updates form data state and filtered user search dropdown list when user changes the
  // value of the search/checkbox input
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;
      setSearchQuery((prev) => ({
        ...prev,
        [name]: type === "search" ? value : checked,
      }));

      if (!showResults) setShowResults(true);
      else if (!value && type === "search") setShowResults(false);
    },
    [searchQuery],
  );

  // when the user clicks on one of the usernames in the filtered user search dropdown list,
  // the search field value is automatically filled with the clicked name and the dropdown list
  // is automatically hidden
  const handleResults = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      let s = e.currentTarget.innerText;
      setSearchQuery((prev) => ({
        ...prev,
        username: s,
      }));

      setShowResults(false);
    },
    [searchQuery.username],
  );

  // when search form is submitted, sets current url search params with form data only if data
  // has truthy value, then retrieves all users that match query parameters
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(setFormLoading(true));
      try {
        let params = Object.fromEntries(
          Object.entries(searchQuery).filter((q) => {
            return q[1];
          }),
        );
        setSearchParams((prev) => ({ ...prev, ...params }));
      } catch (err: any) {
        const error = JSON.parse(err.message);
        notify(error.message);
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    [searchQuery],
  );

  // keyboard friendly search input handler: when the user presses the down arrow button when the
  // keyboard is focused on the user search input, if the below search suggestion list contain one
  // or more suggestions, the keyboard focuses on the search result list instead
  const handleUserSearchInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const results = e.currentTarget.nextElementSibling as HTMLDivElement;
        const resultsAreShown =
          results.querySelectorAll("div[role='option']").length > 0;

        if (results && resultsAreShown) results.focus();
      }
    },
    [],
  );

  // when the search suggestion list first receives keyboard focus, automatically scrolls to the top
  // of the list and highlights/selects the first suggestion
  const handleUserSearchSuggestionsFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      e.currentTarget.scrollTo({ top: 0, behavior: "smooth" });
      const firstResult = e.currentTarget.querySelector("div[role='option']");

      if (firstResult) firstResult.classList.add("selected");
    },
    [],
  );

  // when the search suggestion list loses focus EXCEPT for when the username search input list is
  // receives focus instead, the suggestion list is hidden
  const handleUserSearchSuggestionsBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (
        !(
          e.relatedTarget?.role === "option" ||
          e.relatedTarget?.role === "listbox" ||
          e.relatedTarget?.tagName === "INPUT"
        )
      ) {
        const selectedItem = e.currentTarget.querySelector(
          "div.selected[role='option']",
        ) as HTMLDivElement;
        selectedItem.classList.remove("selected");

        setShowResults(false);
      }
    },
    [],
  );

  // keyboard friendly handler for the user search suggestion list: if either the up or down arrow keys
  // are pressed and there is a selected item in the list, scrolls either up or down respectively and
  // selects the item above or below that item respectively, it it exists; if at the top of the list and
  // the up arrow key is pressed, the keyboard focuses on the search input instead; if the escape key is
  // pressed, the list automatically scrolls to the top, the current selected item is unselected, and
  // the user search input receives focus instead; if the enter key is pressed while an item in the list
  // is selected, the user search input automatically fills itself with the content of the selected list
  // item and the suggestion list is hidden; if an arrow key is pressed while no item is selected,
  // the list automatically scrolls to the top and selects the first item
  const handleUserSearchSuggestionsKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      const selectedItem = e.currentTarget.querySelector(
        "div.selected[role='option']",
      ) as HTMLDivElement;

      const currScroll: number = e.currentTarget.scrollTop;

      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && selectedItem) {
        const nextItem =
          e.key === "ArrowDown"
            ? selectedItem?.nextElementSibling
            : selectedItem?.previousElementSibling;

        if (nextItem) {
          const newScroll =
            e.key === "ArrowDown" ? currScroll + 20 : currScroll - 20;
          selectedItem.classList.remove("selected");
          nextItem.classList.add("selected");
          e.currentTarget.scrollTo({ top: newScroll, behavior: "smooth" });
        } else if (!nextItem && e.key === "ArrowUp") {
          selectedItem?.classList.remove("selected");
          const input = e.currentTarget
            .previousElementSibling as HTMLInputElement;
          input.focus();
        }
      } else if (e.key === "Escape" && selectedItem) {
        selectedItem.classList.remove("selected");
        e.currentTarget.scrollTo({ top: 0, behavior: "smooth" });
        const input = e.currentTarget
          .previousElementSibling as HTMLInputElement;
        input.focus();
      } else if (e.key === "Enter" && selectedItem) {
        selectedItem.click();
      } else if (
        e.key === "ArrowDown" ||
        (e.key === "ArrowUp" && !selectedItem)
      ) {
        e.currentTarget.scrollTo({ top: 0, behavior: "smooth" });
        const firstResult = e.currentTarget.querySelector("div[role='option']");
        if (firstResult) firstResult.classList.add("selected");
      }
    },
    [],
  );

  // when the cursor enters the suggestion list and one of the items in the list is selected,
  // unselects that that item
  const handleUserSearchSuggestionsMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const selectedTarget = e.currentTarget.querySelector(
        "div.selected[role='option']",
      );

      if (selectedTarget) selectedTarget.classList.remove("selected");
    },
    [],
  );

  // keyboard friendly function for checkbox; when checkbox is focused on and the enter key is pressed,
  // checks the box as if the user clicked it with the mouse
  const handleCheckBoxClick = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        e.currentTarget?.click();
      }
    },
    [],
  );

  // keyboard friendly call back; when user focuses on a user card with tab key, clicking the
  // enter button navigates to the correct user profile page based on the username in the
  // parameters
  const handleUserCardKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, username: string) => {
      if (e.key === "Enter") {
        navigate(`/user/${username}`);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const list =
          e.currentTarget.querySelector<HTMLUListElement>(".interest-list ul");

        if (list && e.key) {
          const currScroll = list.scrollTop;
          const nextScroll =
            e.key === "ArrowDown" ? currScroll + 10 : currScroll - 10;
          list.scrollTo({ top: nextScroll, behavior: "smooth" });
        }
      }
    },
    [],
  );

  return {
    searchResults,
    showResults,
    searchedUsers,
    searchQuery,
    loadingUsers,
    loadingNewUsernames,
    handleFocus,
    handleBlur,
    handleResults,
    handleChange,
    handleSubmit,
    handleUserSearchInputKeyDown,
    handleUserSearchSuggestionsFocus,
    handleUserSearchSuggestionsBlur,
    handleUserSearchSuggestionsKeyDown,
    handleUserSearchSuggestionsMouseEnter,
    handleCheckBoxClick,
    handleUserCardKeyDown,
  };
};

export default useUserSearch;
