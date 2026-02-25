import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import type {
  hostedGroupCard,
  nonHostedGroupCard,
} from "../../types/groupTypes";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading, setLoadError } from "../../features/slices/loading";
import { shallowEqual } from "react-redux";
import {
  useSearchParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";

type groupTabs = "hostedGroups" | "nonHostedGroups";

const useGroupList = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual,
  );
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [hostedGroups, setHostedGroups] = useState<hostedGroupCard[]>([]);
  const [nonHostedGroups, setNonHostedGroups] = useState<nonHostedGroupCard[]>(
    [],
  );
  const [currentGroupTab, setCurrentGroupTab] =
    useState<groupTabs>("hostedGroups");

  // on initial render, checks url params for type and sets the current group tab to be that type;
  // futhermore, also gets a list of all groups the user is a part of and sets them in state
  useEffect(() => {
    const getAllGroups = async () => {
      try {
        if (username) {
          dispatch(setFormLoading(true));
          const currentType = searchParams.get("type");
          if (
            currentType &&
            (currentType === "hostedGroups" ||
              currentType === "nonHostedGroups")
          ) {
            setCurrentGroupTab(currentType);
          } else {
            setSearchParams({ type: currentGroupTab });
          }
          const groups = await groupConversationsAPI.getAllGroups(username, {});
          if (!Array.isArray(groups)) {
            setHostedGroups(groups.hostedGroups);
            setNonHostedGroups(groups.nonHostedGroups);
          }
        }
      } catch (err: any) {
        const error = JSON.parse(err.message);
        dispatch(setLoadError(error));
        navigate("/error");
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getAllGroups();
  }, []);

  // navigates to group page with the corresponding id when a card is clicked
  const navigateGroup = useCallback((id: string): void => {
    navigate(`/groups/${id}`);
  }, []);

  // when clicking on either group tab, switches the type of groups shown on the page
  const handleGroupTab = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { title } = e.currentTarget;
      if (title === "hostedGroups" || title === "nonHostedGroups") {
        setCurrentGroupTab(title);
        setSearchParams({ type: title });
      }
    },
    [currentGroupTab],
  );

  // when either group tab is focused, allows user to switch between them using left and right
  // arrow keys on their keyboard
  const handleKeyDownGroupTab = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const nextTab =
          e.key === "ArrowLeft" ? "hostedGroups" : "nonHostedGroups";
        setCurrentGroupTab(nextTab);
        setSearchParams({ type: nextTab });
      }
    },
    [currentGroupTab],
  );

  const handleKeyDownGroupCard = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      if (e.key === "Enter") {
        navigate(`/groups/${id}`);
      }
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
