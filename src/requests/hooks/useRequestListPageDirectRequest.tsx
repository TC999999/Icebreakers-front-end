import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setUnansweredRequests } from "../../features/slices/auth";
import directRequestsAPI from "../../apis/directRequestsAPI";
import type {
  directConversationResponse,
  requestInfiniteQueryRes,
  requestSocketHookProps,
} from "../../types/requestTypes";
import { shallowEqual } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../helpers/queryClient";
import type { InfiniteData } from "@tanstack/react-query";

// custom hook for direct request inbox in request inbox page
const useRequestListPageDirectRequests = ({
  setNewRequestCount,
  refetchRequests,
  requestParams,
}: requestSocketHookProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  // RESPONSES (RECIPIENT'S SIDE ONLY)
  // if request was accepted, the recipient join the group and
  // removes request from both users' inboxes
  const { mutate: respondToDirectRequest } = useMutation({
    mutationFn: (response: directConversationResponse) =>
      directRequestsAPI.respondToDirectConversationRequest(username!, response),

    onMutate: async (response: directConversationResponse) => {
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
    onError: (err: Error, response: directConversationResponse, context) => {
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
    respondToDirectRequest,
  };
};

export default useRequestListPageDirectRequests;
