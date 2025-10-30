import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import {
  setFormLoading,
  setUnansweredRequests,
} from "../../features/slices/auth";
import directRequestsAPI from "../../apis/directRequestsAPI";
import requestsAPI from "../../apis/requestsAPI";
import type {
  sentRequestCard,
  receivedRequestCard,
  requestType,
  directConversationResponse,
  requestCount,
  requestParams,
  SentGroupCard,
  ReceivedGroupCard,
  requestCountChange,
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
import socket from "../../helpers/socket";
import { shallowEqual } from "react-redux";
import groupRequestsAPI from "../../apis/groupRequestsAPI";
import {
  updateSentRequests,
  updateRequestCount,
  type addOrRemove,
} from "../../helpers/updateRequests";

const useRequestListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [viewedRequests, setViewedRequests] = useState<requestType>(
    "direct-requests-received"
  );
  const [currentTitleAndDesc, setViewedTitleAndDesc] = useState<titleAndDesc>(
    requestDesc.get("direct-requests-received") || defaultTitleAndDesc
  );

  const [requestCount, setRequestCount] = useState<requestCount>(initialCount);

  const [currentRequests, setCurrentRequests] = useState<
    (
      | sentRequestCard
      | receivedRequestCard
      | SentGroupCard
      | ReceivedGroupCard
    )[]
  >([]);

  // initial render
  useEffect(() => {
    const getAllRequests = async () => {
      try {
        dispatch(setFormLoading(true));
        if (username) {
          let DoG = searchParams.get("directOrGroup");
          let RoI = searchParams.get("requestOrInvitation");
          let t = searchParams.get("type");
          let currRequests = requestTypeMap[`${DoG}-${RoI}-${t}`];
          setViewedRequests(currRequests);
          setViewedTitleAndDesc(
            requestDesc.get(currRequests) || defaultTitleAndDesc
          );
          if (DoG && RoI && t) {
            const params: requestParams = {
              directOrGroup: DoGMap[DoG],
              requestOrInvitation: RoIMap[RoI],
              type: tMap[t],
            };
            const requests = await requestsAPI.getRequests(username, params);
            setCurrentRequests(requests);
          }
          const count = await requestsAPI.getRequestCount(username);
          setRequestCount(count);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getAllRequests();
  }, []);

  //set new request count
  const setNewRequestCount = (requestChange: requestCountChange) => {
    updateRequestCount(requestChange, setRequestCount);
  };

  // sets new requests in state
  const setNewRequests = (
    request: SentGroupCard | sentRequestCard | directConversationResponse,
    addOrRemove: addOrRemove
  ) => {
    updateSentRequests(request, addOrRemove, setCurrentRequests);
  };

  useEffect(() => {
    socket.on("addRequest", ({ request, requestType, countType }) => {
      setNewRequestCount({ addRequest: countType });
      if (viewedRequests === requestType) {
        setNewRequests(request, "add");
      }
    });

    socket.on("removeRequest", ({ request, requestType, countType }) => {
      setNewRequestCount({ subtractRequest: countType });
      if (viewedRequests === requestType) {
        setNewRequests(request, "remove");
      }
    });

    return () => {
      socket.off("addRequest");
      socket.off("removeRequest");
    };
  }, [viewedRequests, requestCount]);

  const changeViewedRequests = useCallback(
    async (requestType: requestType, params: requestParams) => {
      setViewedRequests(requestType);

      setViewedTitleAndDesc(
        requestDesc.get(requestType) || defaultTitleAndDesc
      );

      if (username) {
        setSearchParams(params);
        const requests = await requestsAPI.getRequests(username, params);
        setCurrentRequests(requests);
      }
    },
    [viewedRequests]
  );

  // update direct requests
  const removeDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      let resentRequest =
        await directRequestsAPI.removeDirectConversationRequest(
          request.id,
          true
        );

      setNewRequests(request, "remove");
      setNewRequestCount({
        addRequest: "removedDirectRequestCount",
        subtractRequest: "sentDirectRequestCount",
      });

      socket.emit("removeRequest", {
        requestType: "direct-requests-received",
        countType: "receivedDirectRequestCount",
        to: request.to,
        request: resentRequest,
      });
    },
    [currentRequests, requestCount]
  );

  const resendDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      let resentRequest =
        await directRequestsAPI.removeDirectConversationRequest(
          request.id,
          false
        );

      setNewRequests(request, "remove");
      setNewRequestCount({
        addRequest: "sentDirectRequestCount",
        subtractRequest: "removedDirectRequestCount",
      });

      socket.emit("addRequest", {
        requestType: "direct-requests-received",
        countType: "receivedDirectRequestCount",
        to: request.to,
        request: resentRequest,
      });
    },
    [currentRequests, requestCount]
  );

  const removeGroupRequest = useCallback(async (request: SentGroupCard) => {
    console.log("group request");
    console.log(request);
  }, []);

  // update group invitations
  const removeGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      // console.log(request);
      let invitation = await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        true
      );

      setNewRequests(request, "remove");
      setNewRequestCount({
        addRequest: "removedGroupInvitationCount",
        subtractRequest: "sentGroupInvitationCount",
      });

      socket.emit("removeRequest", {
        requestType: "group-invites-received",
        countType: "receivedGroupInvitationCount",
        to: request.to,
        request: invitation,
      });
    },
    [currentRequests, requestCount]
  );

  const resendGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      // console.log(request);
      let invitation = await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        false
      );

      setNewRequests(request, "remove");
      setNewRequestCount({
        addRequest: "sentGroupInvitationCount",
        subtractRequest: "removedGroupInvitationCount",
      });

      socket.emit("addRequest", {
        requestType: "group-invites-received",
        countType: "receivedGroupInvitationCount",
        to: request.to,
        request: invitation,
      });
    },
    [currentRequests, requestCount]
  );

  // RESPONSES
  // respond to direct request
  const respondToDirectRequest = useCallback(
    async (response: directConversationResponse) => {
      let { requestResponse } =
        await directRequestsAPI.respondToDirectConversationRequest(response);
      if (requestResponse.conversation) {
        socket.emit("addConversation", {
          conversation: {
            ...requestResponse.conversation,
            unreadMessages: 0,
            otherUser: response.to,
          },
          to: response.from,
        });
      }

      setNewRequests(response, "remove");
      setNewRequestCount({
        subtractRequest: "receivedDirectRequestCount",
      });

      dispatch(setUnansweredRequests(-1));
      socket.emit("response", {
        response,
        to: response.from,
        requestType: "direct-requests-sent",
        countType: "sentDirectRequestCount",
      });
      socket.emit("updateUnansweredRequests", {
        change: -1,
      });
    },
    [currentRequests, dispatch]
  );

  return {
    viewedRequests,
    currentTitleAndDesc,
    currentRequests,
    requestCount,
    changeViewedRequests,
    removeDirectRequest,
    removeGroupRequest,
    resendDirectRequest,
    removeGroupInvitation,
    resendGroupInvitation,
    respondToDirectRequest,
  };
};

export default useRequestListPage;
