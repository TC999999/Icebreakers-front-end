import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const buildRequestType = (): requestType => {
    return (
      requestTypeMap[`${directOrGroup}-${requestOrInvitation}-${type}`] ||
      "direct-requests-received"
    );
  };

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

  // on initial render, gets url search query data and sets the initial selected request tab and
  // the initial header shown based on those params; also retrieves the initial request list to be
  // shown based on the search query and retrieves the count for each unanswered/sent/removed request
  // in each category
  const { data: requests, isFetching } = useQuery({
    queryKey: ["requests", { directOrGroup, requestOrInvitation, type }],
    queryFn: async () =>
      await requestsAPI.getRequests(username!, {
        directOrGroup,
        requestOrInvitation,
        type,
      }),
    retry: 0,
    placeholderData: [],
  });

  const { data: requestCount } = useQuery({
    queryKey: ["requestCount"],
    queryFn: () => requestsAPI.getRequestCount(username!),
    initialData: initialCount,
    retry: 0,
  });

  const {
    respondToDirectRequest,
    removeDirectRequest,
    resendDirectRequest,
    deleteDirectRequest,
    respondToGroupRequest,
    removeGroupRequest,
    resendGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    resendGroupInvitation,
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

  // when user clicks on respective request tab, highlights tab and sets description state to respective
  // text, and retrieves the correct request list from the backend database
  const changeViewedRequests = useCallback(
    async (params: requestParams) => {
      setSearchParams(params);
    },
    [searchParams],
  );

  useEffect(() => {
    if (requests) {
      const requestType: requestType = buildRequestType();
      setViewedRequests(requestType);
      setViewedTitleAndDesc(
        requestDesc.get(requestType) || defaultTitleAndDesc,
      );

      if (showTabletRequestTabs) setShowTabletRequestTabs(false);
    }
  }, [requests]);

  return {
    viewedRequests,
    currentTitleAndDesc,
    requests,
    requestCount,
    showTabletRequestTabs,
    isFetching,
    toggleTabletTabs,
    changeViewedRequests,
    respondToDirectRequest,
    removeDirectRequest,
    resendDirectRequest,
    deleteDirectRequest,
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

export default useRequestListPage;
