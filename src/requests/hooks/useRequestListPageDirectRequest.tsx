import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setUnansweredRequests } from "../../features/slices/auth";
import directRequestsAPI from "../../apis/directRequestsAPI";
import type {
  sentRequestCard,
  directConversationResponse,
  requestSocketHookProps,
  requestInfiniteQueryRes,
} from "../../types/requestTypes";
import { shallowEqual } from "react-redux";
import queryClient from "../../helpers/queryClient";
import type { InfiniteData } from "@tanstack/react-query";

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

  // updates current request list
  const refetchRequests = (id: string, type: string, accepted?: boolean) => {
    console.log(id, accepted);
    queryClient.setQueryData(
      [
        "requests",
        {
          directOrGroup: "direct",
          requestOrInvitation: "requests",
          type,
        },
      ],
      (prev: InfiniteData<requestInfiniteQueryRes, unknown>) => {
        console.log(prev.pages);
        const newMap = prev.pages.map((r) => {
          const newRequests = r.requestList.map((request) => {
            if (request.id === id)
              return { ...request, hasAccepted: accepted, hasResponded: true };
            return request;
          });

          return { ...r, requestList: newRequests };
        });

        return { ...prev, pages: newMap };
      },
    );
  };

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
      refetchRequests(response.id, "received", response.accepted);
      dispatch(setUnansweredRequests(-1));
    },
    [requests, dispatch],
  );

  return {
    respondToDirectRequest,
  };
};

export default useRequestListPageDirectRequests;
