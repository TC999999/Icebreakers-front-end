import { useEffect } from "react";
import type {
  requestType,
  requestCount,
  requestList,
  requestParams,
} from "../../types/requestTypes";
import socket from "../../helpers/socket";
import useRequestListPageDirectRequests from "./useRequestListPageDirectRequest";
import useRequestListPageGroupRequests from "./useRequestListPageGroupRequests";
import queryClient from "../../helpers/queryClient";

type Props = {
  requests: requestList;
  requestCount: requestCount;
  viewedRequests: requestType;
  requestParams: requestParams;
};

// custom hook for websocket logic in request inbox page
const useRequestListPageSockets = ({
  requests,
  viewedRequests,
  requestCount,
  requestParams,
}: Props) => {
  //callback function to set new request count: to only be used in other functions
  const setNewRequestCount = () => {
    queryClient.invalidateQueries({ queryKey: ["requestCount"] });
  };

  // sets up socket listeners on initial render
  useEffect(() => {
    socket.on("addRequest", () => {
      setNewRequestCount();
    });

    socket.on("removeRequest", ({ request, requestType }) => {
      setNewRequestCount();
      if (viewedRequests === requestType) {
        queryClient.setQueryData(
          ["requests", requestParams],
          (prev: requestList[]) => {
            return prev.filter((r) => {
              return r[0].id !== request.id;
            });
          },
        );
      }
    });

    return () => {
      socket.off("addRequest");
      socket.off("removeRequest");
    };
  }, [viewedRequests, requestCount]);

  // custom hook for updating direct request list (after responding to a request or deleting a request)
  const { respondToDirectRequest } = useRequestListPageDirectRequests({
    requests,
    requestCount,
    setNewRequestCount,
  });

  const {
    respondToGroupRequest,
    removeGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    deleteGroupInvitation,
  } = useRequestListPageGroupRequests({
    requests,
    requestCount,
    setNewRequestCount,
  });

  return {
    respondToDirectRequest,
    respondToGroupRequest,
    removeGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    deleteGroupInvitation,
  };
};

export default useRequestListPageSockets;
