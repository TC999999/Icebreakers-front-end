import { useEffect, useState, useCallback } from "react";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import type { GroupPage } from "../../types/groupTypes";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import socket from "../../helpers/socket";

const useGroupPage = () => {
  const { id } = useParams();
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialGroup: GroupPage = {
    id: "",
    title: "",
    description: "",
    host: "",
    createdAt: "",
    users: [],
    interests: [],
  };

  const [group, setGroup] = useState<GroupPage>(initialGroup);
  const [isInGroupState, setIsInGroupState] = useState<boolean>(false);
  const [requestPendingState, setRequestPendingState] =
    useState<boolean>(false);

  useEffect(() => {
    const getGroup = async () => {
      try {
        dispatch(setFormLoading(true));
        if (id) {
          const { group, isInGroup, requestPending } =
            await groupConversationsAPI.getGroup(id);
          if ("id" in group) setGroup(group);
          if (isInGroup !== undefined && requestPending !== undefined) {
            setIsInGroupState(isInGroup);
            setRequestPendingState(requestPending);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getGroup();
  }, []);

  useEffect(() => {
    socket.on("addUserToGroup", ({ groupID, user }) => {
      if (group.id === groupID) {
        setGroup((prev) => ({ ...prev, users: [...prev.users, user] }));
      }
    });

    return () => {
      socket.off("addUserToGroup");
    };
  }, [group.users]);

  const handleNavigate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigate(`/groups/${id}/request`);
    },
    []
  );

  return { group, isInGroupState, requestPendingState, handleNavigate };
};

export default useGroupPage;
