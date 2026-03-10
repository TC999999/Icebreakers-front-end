import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setUnansweredRequests } from "../../features/slices/auth";
import type {
  SentGroupCard,
  groupConversationResponse,
  requestSocketHookProps,
  requestList,
} from "../../types/requestTypes";
import { shallowEqual } from "react-redux";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import queryClient from "../../helpers/queryClient";

// custom hook for group request/invitation inboxes in request inbox page
const useRequestListPageGroupRequests = ({
  requests,
  requestCount,
  setNewRequestCount,
}: requestSocketHookProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const refetchRequests = (
    id: string,
    requestOrInvitation: string,
    type: string,
  ) => {
    queryClient.setQueryData(
      [
        "requests",
        {
          directOrGroup: "group",
          requestOrInvitation,
          type,
        },
      ],
      (prev: requestList[]) => {
        return prev.filter((r) => {
          return r[0].id !== id;
        });
      },
    );
  };

  // UPDATE GROUP REQUESTS (SENDER'S SIDE ONLY)
  // removes request from recipient's received group requests inbox and moves it from
  // senders sent group request inbox to their removed group request inbox
  const removeGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.removeRequest(request.id, username!, true);
      setNewRequestCount();
      refetchRequests(request.id, "requests", "sent");
    },
    [requests, requestCount],
  );

  // UPDATE GROUP INVITATIONS (SENDER'S SIDE ONLY)
  // removes invitation from recipient's sent group invitation inbox and moves it from
  // senders sent group invitation inbox to their removed group invitation inbox
  const removeGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        username!,
        true,
      );
      setNewRequestCount();
      refetchRequests(request.id, "invitations", "sent");
    },
    [requests, requestCount],
  );

  // DELETION (SENDER'S SIDE ONLY)
  // deletes group invitation entirely from senders's inbox
  const deleteGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.deleteGroupConversationInvitation(
        request.id,
        username!,
        { to: request.to, groupID: request.groupID },
      );
      setNewRequestCount();
      refetchRequests(request.id, "invitations", "removed");
    },
    [requests, requestCount],
  );

  // deletes group request entirely from senders's inbox
  const deleteGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.deleteGroupRequest(request.id, username!, {
        groupID: request.groupID,
      });
      setNewRequestCount();
      refetchRequests(request.id, "requests", "removed");
    },
    [requests, requestCount],
  );

  // RESPONSES (RECIPIENT'S SIDE ONLY)
  // if invitation was accepted, the recipient join the group and
  // removes invitation from both users' inboxes
  const respondToGroupInvitation = useCallback(
    async (response: groupConversationResponse) => {
      // await groupRequestsAPI.respondToGroupInvitation(username!, response);
      setNewRequestCount();
      refetchRequests(response.id, "invitations", "received");
      dispatch(setUnansweredRequests(-1));
    },
    [],
  );

  // if request was accepted, the sender join the group and removes
  // request from both users' inboxes
  const respondToGroupRequest = useCallback(
    async (response: groupConversationResponse) => {
      // await groupRequestsAPI.respondToGroupRequest(username!, response);
      setNewRequestCount();
      refetchRequests(response.id, "requests", "received");
      dispatch(setUnansweredRequests(-1));
    },
    [],
  );

  return {
    respondToGroupRequest,
    removeGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    deleteGroupInvitation,
  };
};

export default useRequestListPageGroupRequests;
