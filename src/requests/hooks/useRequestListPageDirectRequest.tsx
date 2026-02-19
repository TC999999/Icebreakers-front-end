import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setUnansweredRequests } from "../../features/slices/auth";
import directRequestsAPI from "../../apis/directRequestsAPI";
import type {
  sentRequestCard,
  directConversationResponse,
  requestSocketHookProps,
  requestList,
} from "../../types/requestTypes";
import { shallowEqual } from "react-redux";
import queryClient from "../../helpers/queryClient";

// custom hook for direct request inbox in request inbox page
const useRequestListPageDirectRequests = ({
  requests,
  requestCount,
  setNewRequestCount,
}: requestSocketHookProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const refetchRequests = (id: string, type: string) => {
    queryClient.setQueryData(
      [
        "requests",
        {
          directOrGroup: "direct",
          requestOrInvitation: "requests",
          type,
        },
      ],
      (prev: requestList) => {
        return prev.filter((r) => {
          return r.id !== id;
        });
      },
    );
  };

  // UPDATE DIRECT REQUESTS (SENDER'S SIDE ONLY)
  // removes request from recipient's inbox and moves it from senders sent request inbox
  // to their removed request inbox
  const removeDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      await directRequestsAPI.removeDirectConversationRequest(
        request.id,
        username!,
        true,
      );
      setNewRequestCount();
      refetchRequests(request.id, "sent");
    },
    [requests, requestCount],
  );

  // resend direct request to recipient's inbox
  const resendDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      await directRequestsAPI.removeDirectConversationRequest(
        request.id,
        username!,
        false,
      );
      setNewRequestCount();
      refetchRequests(request.id, "removed");
    },
    [requests, requestCount],
  );

  // DELETION (SENDER'S SIDE ONLY)
  // deletes direct request entirely from senders's inbox
  const deleteDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      await directRequestsAPI.deleteDirectConversationRequest(
        request.id,
        username!,
        { to: request.to },
      );
      setNewRequestCount();
      refetchRequests(request.id, "removed");
    },
    [requests, requestCount],
  );

  // RESPONSES (RECIPIENT'S SIDE ONLY)
  // if request was accepted, the recipient join the group and
  // removes request from both users' inboxes
  const respondToDirectRequest = useCallback(
    async (response: directConversationResponse) => {
      await directRequestsAPI.respondToDirectConversationRequest(
        username!,
        response,
      );
      setNewRequestCount();
      refetchRequests(response.id, "received");

      dispatch(setUnansweredRequests(-1));
    },
    [requests, dispatch],
  );

  return {
    respondToDirectRequest,
    removeDirectRequest,
    resendDirectRequest,
    deleteDirectRequest,
  };
};

export default useRequestListPageDirectRequests;
