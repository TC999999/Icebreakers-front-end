import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import type {
  hostedGroupCard,
  nonHostedGroupCard,
} from "../../types/groupTypes";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import { shallowEqual } from "react-redux";
import { useSearchParams } from "react-router-dom";

type groupTabs = "hostedGroups" | "nonHostedGroups";

const useGroupList = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );
  const dispatch: AppDispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const [hostedGroups, setHostedGroups] = useState<hostedGroupCard[]>([]);
  const [nonHostedGroups, setNonHostedGroups] = useState<nonHostedGroupCard[]>(
    []
  );
  const [currentGroupTab, setCurrentGroupTab] =
    useState<groupTabs>("hostedGroups");

  useEffect(() => {
    const getAllGroups = async () => {
      if (username) {
        dispatch(setFormLoading(true));
        const currentType = searchParams.get("type");
        if (
          currentType &&
          (currentType === "hostedGroups" || currentType === "nonHostedGroups")
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

        dispatch(setFormLoading(false));
      }
    };

    getAllGroups();
  }, []);

  const handleGroupTab = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { title } = e.currentTarget;
      if (title === "hostedGroups" || title === "nonHostedGroups") {
        setCurrentGroupTab(title);
        setSearchParams({ type: title });
      }
    },
    [currentGroupTab]
  );

  return { hostedGroups, nonHostedGroups, currentGroupTab, handleGroupTab };
};

export default useGroupList;
