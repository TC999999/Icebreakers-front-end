import { useState, useEffect } from "react";
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

const useGroupList = () => {
  const username = useAppSelector(
    (store) => store.user.user?.username,
    shallowEqual
  );
  const dispatch: AppDispatch = useAppDispatch();

  const [hostedGroups, setHostedGroups] = useState<hostedGroupCard[]>([]);
  const [nonHostedGroups, setNonHostedGroups] = useState<nonHostedGroupCard[]>(
    []
  );

  useEffect(() => {
    const getAllGroups = async () => {
      if (username) {
        dispatch(setFormLoading(true));
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
  return { hostedGroups, nonHostedGroups };
};

export default useGroupList;
