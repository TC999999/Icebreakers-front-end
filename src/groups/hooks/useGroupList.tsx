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
    isError,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupConversationsAPI.getAllGroups(username!),
    retry: 0,
    initialData: { hostedGroups: [], nonHostedGroups: [] },
  });

  useLoading({ isFetching: isLoading });
  const { handleMountRequestError } = useRequestErrorHandler();

  useEffect(() => {
    if (!currentGroupTab) setSearchParams({ type: "hosted" });
  }, [currentGroupTab]);

  useEffect(() => {
    if (isError) handleMountRequestError(error);
  }, [isError, error]);

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
