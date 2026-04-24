import { useCallback, useEffect } from "react";
import { useAppSelector } from "../../features/hooks";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import { shallowEqual } from "react-redux";
import {
  useSearchParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useLoading from "../../appHooks/useLoading";
import useRequestErrorHandler from "../../appHooks/useRequestErrorHandler";

// custom hook for group list component that handles redirecting the user to a specific
// group page and the tabs at the top of the page
const useGroupList = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual,
  );

  const navigate: NavigateFunction = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentGroupTab: string = searchParams.get("type") || "hosted";

  // on initial render, checks url params for type and sets the current group tab to be that type;
  // futhermore, also gets a list of all groups the user is a part of and sets them in state

  const {
    data: { hostedGroups, nonHostedGroups },
    isLoading,
    isLoadingError,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupConversationsAPI.getAllGroups(username!),
    retry: 0,
    initialData: { hostedGroups: [], nonHostedGroups: [] },
  });

  // reusable hook that displays loading message when fetching group data
  useLoading({ isFetching: isLoading });

  // reusable hook for handling errors that may occur during initial mount
  const { handleMountRequestError } = useRequestErrorHandler();

  // sets default search params to hosted groups (if users copy and paste the url)
  useEffect(() => {
    if (!currentGroupTab) setSearchParams({ type: "hosted" });
  }, [currentGroupTab]);

  // on initial mount, if an error occurs while collecting data, the user will be
  // redirected to the error page
  useEffect(() => {
    if (isLoadingError && error) handleMountRequestError(error);
  }, [isLoadingError, error]);

  // navigates to group page with the corresponding id when a card is clicked
  const navigateGroup = useCallback((id: string): void => {
    navigate(`/groups/${id}`);
  }, []);

  // when clicking on either group tab, switches the type of groups shown on the page
  const handleGroupTab = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { title } = e.currentTarget;
      if (title === "hosted" || title === "nonHosted")
        setSearchParams({ type: title });
    },
    [currentGroupTab],
  );

  // when either group tab is focused, allows user to switch between them using left and right
  // arrow keys on their keyboard
  const handleKeyDownGroupTab = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const nextTab = e.key === "ArrowLeft" ? "hosted" : "nonHosted";
        setSearchParams({ type: nextTab });
      }
    },
    [currentGroupTab],
  );

  // a11y friendly function that when the user clicks the enter key while focused
  // on a group card, they will be redirected to that particular group page
  const handleKeyDownGroupCard = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      if (e.key === "Enter") navigate(`/groups/${id}`);
    },
    [],
  );

  return {
    hostedGroups,
    nonHostedGroups,
    currentGroupTab,
    navigateGroup,
    handleGroupTab,
    handleKeyDownGroupTab,
    handleKeyDownGroupCard,
  };
};

export default useGroupList;
