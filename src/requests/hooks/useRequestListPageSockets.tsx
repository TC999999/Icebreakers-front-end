import { useEffect, useCallback } from "react";
import type {
  requestType,
  requestCount,
  requestInfiniteQueryRes,
  requestParams,
} from "../../types/requestTypes";
import socket from "../../helpers/socket";
import useRequestListPageDirectRequests from "./useRequestListPageDirectRequest";
import useRequestListPageGroupRequests from "./useRequestListPageGroupRequests";
import type { InfiniteData } from "@tanstack/react-query";
import queryClient from "../../helpers/queryClient";

type Props = {
  requestCount: requestCount;
  viewedRequests: requestType;
  requestParams: requestParams;
};

// custom hook for websocket logic in request inbox page
const useRequestListPageSockets = ({
  viewedRequests,
  requestCount,
  requestParams,
}: Props) => {
  // sets up socket listeners on initial render
  useEffect(() => {
    socket.on("addRequest", async ({ request, requestType }) => {
      if (requestType === viewedRequests) {
        await queryClient.cancelQueries({
          queryKey: ["requests", requestParams],
        });

        const { content, createdAt, from, id } = request;

        queryClient.setQueryData(
          ["requests", requestParams],
          (prevData: InfiniteData<requestInfiniteQueryRes, number>) => {
            const newRequest = {
              content,
              createdAt,
              from,
              id,
              hasAccepted: false,
              hasResponded: false,
            };

            return {
              ...prevData,
              pages: prevData.pages.map((page, i) => {
                return i === 0
                  ? { ...page, requestList: [newRequest, ...page.requestList] }
                  : page;
              }),
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["requests", requestParams],
        });
      }
      setNewRequestCount();
    });

    socket.on("removeRequest", async ({ response, requestType }) => {
      if (viewedRequests === requestType) {
        await queryClient.cancelQueries({
          queryKey: ["requests", requestParams],
        });

        const { id } = response;
        refetchRequests(id);
        queryClient.invalidateQueries({
          queryKey: ["requests", requestParams],
        });
      }
      setNewRequestCount();
    });

    return () => {
      socket.off("addRequest");
      socket.off("removeRequest");
    };
  }, [viewedRequests, requestCount, requestParams, queryClient]);

  //callback function to set new request count: to only be used in other functions
  const setNewRequestCount = () => {
    queryClient.invalidateQueries({ queryKey: ["requestCount"] });
  };

  // updates current request list
  const refetchRequests = useCallback(
    (id: string) => {
      queryClient.setQueryData(
        ["requests", requestParams],
        (prev: InfiniteData<requestInfiniteQueryRes, number>) => {
          const newMap = prev.pages.map((r) => {
            const newRequests = r.requestList.filter((request) => {
              return request.id !== id;
            });

            return { ...r, requestList: newRequests };
          });

          return { ...prev, pages: newMap };
        },
      );
    },
    [requestParams, queryClient],
  );

  // custom hook for updating direct request list (after responding to a request or deleting a request)
  const { respondToDirectRequest } = useRequestListPageDirectRequests({
    setNewRequestCount,
    refetchRequests,
    requestParams,
  });

  const { respondToGroupRequest, respondToGroupInvitation } =
    useRequestListPageGroupRequests({
      setNewRequestCount,
      refetchRequests,
      requestParams,
    });

  return {
    respondToDirectRequest,
    respondToGroupRequest,
    respondToGroupInvitation,
  };
};

export default useRequestListPageSockets;
