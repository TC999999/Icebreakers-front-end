import { useEffect, useState, useCallback } from "react";
import groupConversationsAPI from "../../apis/groupConversationsAPI";
import type { GroupPage } from "../../types/groupTypes";
import { useParams, useNavigate, createSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import type { AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import socket from "../../helpers/socket";

// custom hook for group page, handles navigating to group messages, form to request to join,
// and showing all information about the group
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
  const [invitationPendingState, setInvitationPendingState] =
    useState<boolean>(false);

  // on initial render, retrieves group information, including list of users in the group; also checks
  // if the current user has either a request/invitation to join the group made or if they are already
  // a member of this group
  useEffect(() => {
    const getGroup = async () => {
      try {
        dispatch(setFormLoading(true));
        if (id) {
          const { group, isInGroup, requestPending, invitationPending } =
            await groupConversationsAPI.getGroup(id);
          if ("id" in group) setGroup(group);
          if (
            isInGroup !== undefined &&
            requestPending !== undefined &&
            invitationPending !== undefined
          ) {
            setIsInGroupState(isInGroup);
            setRequestPendingState(requestPending);
            setInvitationPendingState(invitationPending);
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

  // when a new member joins the group (either by the host accepting their request or the user
  // accepting an invitation to join), automatically adds the new member to list of users
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

  // reusable callback automatically navigates to the page linked by the url; used for buttons
  const handleNavigateRequest = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigate(`/groups/${group.id}/request`);
    },
    [group.id]
  );

  // navigates to group conversation page and injects url search params for group id
  const handleNavigateConversations = useCallback(() => {
    navigate({
      pathname: "/conversations/groups",
      search: `?${createSearchParams({ id: group.id })}`,
    });
  }, [group.id]);

  return {
    group,
    isInGroupState,
    requestPendingState,
    invitationPendingState,
    handleNavigateRequest,
    handleNavigateConversations,
  };
};

export default useGroupPage;
