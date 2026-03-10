import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../features/hooks";
import requestsAPI from "../../apis/requestsAPI";
import type {
  requestType,
  requestCount,
  requestParams,
} from "../../types/requestTypes";
import requestDesc from "../../helpers/maps/requestList";
import {
  requestTypeMap,
  DoGMap,
  RoIMap,
  tMap,
} from "../../helpers/maps/requestTypeMap";
import { type titleAndDesc } from "../../types/miscTypes";
import { useSearchParams } from "react-router-dom";
import { shallowEqual } from "react-redux";
import useRequestListPageSockets from "./useRequestListPageSockets";
import queryClient from "../../helpers/queryClient";

// custom hook for request inbox page
const useRequestListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const directOrGroup = searchParams.get("directOrGroup") || "direct";
  const requestOrInvitation =
    searchParams.get("requestOrInvitation") || "requests";
  const type = searchParams.get("type") || "receieved";
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const defaultTitleAndDesc: titleAndDesc = { title: "", description: "" };
  const initialCount: requestCount = {
    receivedDirectRequestCount: 0,
    sentDirectRequestCount: 0,
    removedDirectRequestCount: 0,
    receivedGroupInvitationCount: 0,
    sentGroupInvitationCount: 0,
    removedGroupInvitationCount: 0,
    receivedGroupRequestCount: 0,
    sentGroupRequestCount: 0,
    removedGroupRequestCount: 0,
  };

  // builds a reusable requestType type string for currently viewed requests by pulling the values from
  // the url search parameters and returning the correct value from the requestType map; used for getting
  // correct title and description shown in the component
  const buildRequestType = (): requestType => {
    return (
      requestTypeMap[`${directOrGroup}-${requestOrInvitation}-${type}`] ||
      "direct-requests-received"
    );
  };

  // builds a reusable request parameters type object for the currently viewed requests by pulling the values
  // from the url search parameters and retrieving the correct value from their respective maps; used for
  // fetching data
  const buildRequestParams = (): requestParams => {
    return {
      directOrGroup: DoGMap[directOrGroup] || "direct",
      requestOrInvitation: RoIMap[requestOrInvitation] || "requests",
      type: tMap[type] || "received",
    };
  };

  const [viewedRequests, setViewedRequests] =
    useState<requestType>(buildRequestType);
  const [currentTitleAndDesc, setViewedTitleAndDesc] = useState<titleAndDesc>(
    requestDesc.get(buildRequestType()) || defaultTitleAndDesc,
  );

  const [showTabletRequestTabs, setShowTabletRequestTabs] =
    useState<boolean>(false);

  // use infinite query initially receives a single request, but continuously receives new requests as user
  // calls fetchNextPage function until hasNextPage boolean is false; also fetches new requests whenever query
  // key parameters are changed (which in this case is the url search parameters)
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["requests", { directOrGroup, requestOrInvitation, type }],
    queryFn: async ({ pageParam }) =>
      await requestsAPI.getRequests(username!, {
        directOrGroup,
        requestOrInvitation,
        type,
        ...pageParam,
      }),
    retry: 0,
    initialPageParam: { offset: 0 },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.next) return { offset: lastPageParam.offset + 2 };
      return undefined;
    },
  });

  // flattens infinite query data to an array of request cards
  const requests = useMemo(() => {
    return (
      data?.pages.flatMap((r) => {
        return r.requestList;
      }) || []
    );
  }, [data]);

  // retrieves data from server containing total count of all request types a user currently has
  const { data: requestCount } = useQuery({
    queryKey: ["requestCount"],
    queryFn: () => requestsAPI.getRequestCount(username!),
    initialData: initialCount,
    retry: 0,
  });

  // when new requests are being loaded in, updates viewed request type and description:
  // highlights the respective tab on the left and changes current description being shown;
  // if tablet request tabs being shown, they are hidden afterwards
  useEffect(() => {
    if (isLoading) {
      const requestType: requestType = buildRequestType();
      setViewedRequests(requestType);
      setViewedTitleAndDesc(
        requestDesc.get(requestType) || defaultTitleAndDesc,
      );
      if (showTabletRequestTabs) setShowTabletRequestTabs(false);
    }
  }, [isLoading]);

  // custom hook that listens for socket signals from server for when a new request is being added or removed
  const {
    respondToDirectRequest,
    respondToGroupRequest,
    removeGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    deleteGroupInvitation,
  } = useRequestListPageSockets({
    requests,
    requestCount,
    viewedRequests,
    requestParams: buildRequestParams(),
  });

  // if hidden request tab list is shown on smaller screen, automatically hides tab list if
  // screen width is wider than 1173px
  useEffect(() => {
    const handleResize = () => {
      if (showTabletRequestTabs && window.innerWidth > 1173) {
        setShowTabletRequestTabs(false);
      }
    };
    window.addEventListener("resize", handleResize);
  }, [showTabletRequestTabs]);

  // when user clicks on upper left hand corner button (when visible) either hides or shows request
  // category tabs on smaller screens
  const toggleTabletTabs = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      setShowTabletRequestTabs(!showTabletRequestTabs);
    },
    [showTabletRequestTabs],
  );

  // when user clicks on respective request tab, clears previous request cache and updates url search
  // parameters
  const changeViewedRequests = useCallback(
    async (params: requestParams) => {
      queryClient.removeQueries({
        queryKey: ["requests", { directOrGroup, requestOrInvitation, type }],
      });
      setSearchParams(params);
    },
    [searchParams],
  );

  return {
    viewedRequests,
    currentTitleAndDesc,
    requests,
    requestCount,
    showTabletRequestTabs,
    isLoading,
    hasNextPage,
    toggleTabletTabs,
    changeViewedRequests,
    respondToDirectRequest,
    respondToGroupRequest,
    removeGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    deleteGroupInvitation,
    fetchNextPage,
  };
};

export default useRequestListPage;
