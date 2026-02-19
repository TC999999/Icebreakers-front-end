import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setUnansweredRequests } from "../../features/slices/auth";
import type {
  SentGroupCard,
  groupConversationResponse,
  requestSocketHookProps,
} from "../../types/requestTypes";
import socket from "../../helpers/socket";
import { shallowEqual } from "react-redux";
import groupRequestsAPI from "../../apis/groupRequestsAPI";

// custom hook for group request/invitation inboxes in request inbox page
const useRequestListPageGroupRequests = ({
  requests,
  requestCount,
  setNewRequestCount,
  // handleRequests,
  // setNewRequests,
}: requestSocketHookProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  // UPDATE GROUP REQUESTS (SENDER'S SIDE ONLY)
  // removes request from recipient's received group requests inbox and moves it from
  // senders sent group request inbox to their removed group request inbox
  const removeGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      const removedRequest = await groupRequestsAPI.removeRequest(
        request.id,
        username!,
        true,
      );

      // handleRequests(
      //   request,
      //   "remove",
      //   // {
      //   //   addRequest: "removedGroupRequestCount",
      //   //   subtractRequest: "sentGroupRequestCount",
      //   // },
      //   "removeRequest",
      //   {
      //     requestType: "group-requests-received",
      //     countType: "receivedGroupRequestCount",
      //     to: request.to,
      //     request: removedRequest,
      //   },
      // );
    },
    [requests, requestCount],
  );

  // removes a single request from the user's removed group requests inbox, moves it to their sent
  // group requests inbox, and sends request to its intended recipient via websocket
  const resendGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      const resentRequest = await groupRequestsAPI.removeRequest(
        request.id,
        username!,
        false,
      );

      // handleRequests(
      //   request,
      //   "remove",
      //   // {
      //   //   addRequest: "sentGroupRequestCount",
      //   //   subtractRequest: "removedGroupRequestCount",
      //   // },
      //   "addRequest",
      //   {
      //     requestType: "group-requests-received",
      //     countType: "receivedGroupRequestCount",
      //     to: request.to,
      //     request: resentRequest,
      //   },
      // );
    },
    [requests, requestCount],
  );

  // UPDATE GROUP INVITATIONS (SENDER'S SIDE ONLY)
  // removes invitation from recipient's sent group invitation inbox and moves it from
  // senders sent group invitation inbox to their removed group invitation inbox
  const removeGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      let invitation = await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        username!,
        true,
      );

      // handleRequests(
      //   request,
      //   "remove",
      //   // {
      //   //   addRequest: "removedGroupInvitationCount",
      //   //   subtractRequest: "sentGroupInvitationCount",
      //   // },
      //   "removeRequest",
      //   {
      //     requestType: "group-invites-received",
      //     countType: "receivedGroupInvitationCount",
      //     to: request.to,
      //     request: invitation,
      //   },
      // );
    },
    [requests, requestCount],
  );

  const resendGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      let invitation = await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        username!,
        false,
      );

      // handleRequests(
      //   request,
      //   "remove",
      //   // {
      //   //   addRequest: "sentGroupInvitationCount",
      //   //   subtractRequest: "removedGroupInvitationCount",
      //   // },
      //   "addRequest",
      //   {
      //     requestType: "group-invites-received",
      //     countType: "receivedGroupInvitationCount",
      //     to: request.to,
      //     request: invitation,
      //   },
      // );
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
      // setNewRequests(request, "remove");
      setNewRequestCount();
    },
    [requests, requestCount],
  );

  // deletes group request entirely from senders's inbox
  const deleteGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.deleteGroupRequest(request.id, username!, {
        groupID: request.groupID,
      });
      // setNewRequests(request, "remove");
      setNewRequestCount();
    },
    [requests, requestCount],
  );

  // RESPONSES (RECIPIENT'S SIDE ONLY)
  // if invitation was accepted, the recipient join the group and
  // removes invitation from both users' inboxes
  const respondToGroupInvitation = useCallback(
    async (response: groupConversationResponse) => {
      let res = await groupRequestsAPI.respondToGroupInvitation(
        username!,
        response,
      );
      if (res.user) {
        socket.emit("addUserToGroup", {
          user: res.user,
          groupID: response.groupID,
        });
      }
      // handleRequests(
      //   response,
      //   "remove",
      //   // {
      //   //   subtractRequest: "receivedGroupInvitationCount",
      //   // },
      //   "response",
      //   {
      //     to: response.from,
      //     requestType: "group-invites-sent",
      //     countType: "sentGroupInvitationCount",
      //     response,
      //   },
      // );

      dispatch(setUnansweredRequests(-1));

      if (res.user) {
        socket.emit("joinGroup", { group: { id: response.groupID } });
      }
    },
    [],
  );

  // if request was accepted, the sender join the group and removes
  // request from both users' inboxes
  const respondToGroupRequest = useCallback(
    async (response: groupConversationResponse) => {
      let res = await groupRequestsAPI.respondToGroupRequest(
        username!,
        response,
      );
      if (res.user) {
        socket.emit("addUserToGroup", {
          user: res.user,
          groupID: response.groupID,
        });

        socket.emit("bringIntoGroup", {
          to: response.from,
          group: { id: response.groupID },
        });
      }
      // handleRequests(
      //   response,
      //   "remove",
      //   // {
      //   //   subtractRequest: "receivedGroupRequestCount",
      //   // },
      //   "response",
      //   {
      //     to: response.from,
      //     requestType: "group-requests-sent",
      //     countType: "sentGroupRequestCount",
      //     response,
      //   },
      // );

      dispatch(setUnansweredRequests(-1));
    },
    [],
  );

  return {
    respondToGroupRequest,
    removeGroupRequest,
    resendGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    resendGroupInvitation,
    deleteGroupInvitation,
  };
};

export default useRequestListPageGroupRequests;
