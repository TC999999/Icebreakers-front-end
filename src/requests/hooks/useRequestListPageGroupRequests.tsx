import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setUnansweredRequests } from "../../features/slices/auth";
import type {
  groupConversationResponse,
  requestSocketHookProps,
  requestInfiniteQueryRes,
} from "../../types/requestTypes";
import { shallowEqual } from "react-redux";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import queryClient from "../../helpers/queryClient";
import { useMutation, type InfiniteData } from "@tanstack/react-query";

// custom hook for group request/invitation inboxes in request inbox page
const useRequestListPageGroupRequests = ({
  setNewRequestCount,
  refetchRequests,
  requestParams,
}: requestSocketHookProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  // RESPONSES (RECIPIENT'S SIDE ONLY)
  // if invitation was accepted, the recipient join the group and
  // removes invitation from both users' inboxes
  const { mutate: respondToGroupInvitation } = useMutation({
    mutationFn: (response: groupConversationResponse) =>
      groupRequestsAPI.respondToGroupInvitation(username!, response),
    onMutate: async (response: groupConversationResponse) => {
      await queryClient.cancelQueries({
        queryKey: ["requests", requestParams],
      });
      const previousPages = queryClient.getQueryData<
        InfiniteData<requestInfiniteQueryRes, number>
      >(["requests", requestParams]);
      refetchRequests(response.id);
      return { previousPages };
    },
    onSuccess: () => {
      setNewRequestCount();
      dispatch(setUnansweredRequests(-1));
    },
    onError: (err: Error, response: groupConversationResponse, context) => {
      queryClient.setQueryData(
        ["requests", requestParams],
        context?.previousPages,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", requestParams] });
    },
  });

  // if request was accepted, the sender join the group and removes
  // request from both users' inboxes
  const { mutate: respondToGroupRequest } = useMutation({
    mutationFn: (response: groupConversationResponse) =>
      groupRequestsAPI.respondToGroupRequest(username!, response),
    onMutate: async (response: groupConversationResponse) => {
      await queryClient.cancelQueries({
        queryKey: ["requests", requestParams],
      });
      const previousPages = queryClient.getQueryData<
        InfiniteData<requestInfiniteQueryRes, number>
      >(["requests", requestParams]);
      refetchRequests(response.id);
      return { previousPages };
    },
    onSuccess: () => {
      setNewRequestCount();
      dispatch(setUnansweredRequests(-1));
    },
    onError: (err: Error, response: groupConversationResponse, context) => {
      queryClient.setQueryData(
        ["requests", requestParams],
        context?.previousPages,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", requestParams] });
    },
  });

  return {
    respondToGroupInvitation,
    respondToGroupRequest,
  };
};

export default useRequestListPageGroupRequests;
