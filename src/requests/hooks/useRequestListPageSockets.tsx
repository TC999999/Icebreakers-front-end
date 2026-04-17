import { useEffect, useCallback } from "react";
import type {
  RequestType,
  RequestCount,
  RequestInfiniteQueryRes,
  RequestParams,
  RequestCountSTR,
} from "../../types/requestTypes";
import { requestCountMap } from "../../helpers/maps/requestTypeMap";
import socket from "../../helpers/socket";
import useRequestListPageDirectRequests from "./useRequestListPageDirectRequest";
import useRequestListPageGroupRequests from "./useRequestListPageGroupRequests";
import type { InfiniteData } from "@tanstack/react-query";
import queryClient from "../../helpers/queryClient";

type Props = {
  requestCount: RequestCount;
  viewedRequests: RequestType;
  requestParams: RequestParams;
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
      await queryClient.cancelQueries({ queryKey: ["requestCount"] });
      if (requestType === viewedRequests) {
        await queryClient.cancelQueries({
          queryKey: ["requests", requestParams],
        });

        queryClient.setQueryData(
          ["requests", requestParams],
          (prevData: InfiniteData<RequestInfiniteQueryRes, number>) => {
            return {
              ...prevData,
              pages: prevData.pages.map((page, i) => {
                return i === 0
                  ? { ...page, requestList: [request, ...page.requestList] }
                  : page;
              }),
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["requests", requestParams],
        });
      }
      queryClient.setQueryData(["requestCount"], (prevData: RequestCount) => {
        const requestCountStr = requestCountMap[requestType];
        return {
          ...prevData,
          [requestCountStr]: prevData[requestCountStr] + 1,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["requestCount"] });
    });

    socket.on("removeRequest", async ({ response, requestType }) => {
      await queryClient.cancelQueries({ queryKey: ["requestCount"] });
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

      queryClient.setQueryData(["requestCount"], (prevData: RequestCount) => {
        const requestCountStr = requestCountMap[requestType];
        return {
          ...prevData,
          [requestCountStr]: prevData[requestCountStr] - 1,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["requestCount"] });
    });

    return () => {
      socket.off("addRequest");
      socket.off("removeRequest");
    };
  }, [viewedRequests, requestCount, requestParams, queryClient]);

  //callback function to set new request count: to only be used in other functions
  const setNewRequestCount = useCallback(
    async (requestType: RequestCountSTR) => {
      await queryClient.cancelQueries({ queryKey: ["requestCount"] });
      queryClient.setQueryData(["requestCount"], (prevData: RequestCount) => {
        return { ...prevData, [requestType]: prevData[requestType] - 1 };
      });

      queryClient.invalidateQueries({ queryKey: ["requestCount"] });
    },
    [queryClient],
  );

  // updates current request list
  const refetchRequests = useCallback(
    (id: string) => {
      queryClient.setQueryData(
        ["requests", requestParams],
        (prev: InfiniteData<RequestInfiniteQueryRes, number>) => {
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
