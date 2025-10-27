import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import {
  setFormLoading,
  setUnansweredRequests,
} from "../../features/slices/auth";
import requestsAPI from "../../apis/requestsAPI";
import type {
  sentRequestCard,
  receivedRequestCard,
  requestType,
  directConversationResponse,
} from "../../types/requestTypes";
import requestDesc from "../../helpers/maps/requestList";
import { type titleAndDesc } from "../../types/miscTypes";
import removeRequestFromRequested from "../../helpers/removeRequest";
import removeSentRequest from "../../helpers/removeSentRequest";
import addRequest from "../../helpers/addRequest";
import socket from "../../helpers/socket";
import { shallowEqual } from "react-redux";

const useRequestListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const defaultTitleAndDesc: titleAndDesc = { title: "", description: "" };

  const [viewedRequests, setViewedRequests] = useState<requestType>("received");
  const [currentTitleAndDesc, setViewedTitleAndDesc] = useState<titleAndDesc>(
    requestDesc.get("received") || defaultTitleAndDesc
  );

  const [sentRequests, setSendRequests] = useState<sentRequestCard[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<
    receivedRequestCard[]
  >([]);
  const [removedRequests, setRemovedRequests] = useState<sentRequestCard[]>([]);
  const [groupInvitations, setGroupInvitations] = useState([]);
  const [groupRequestsReceived, setGroupRequestsReceived] = useState([]);
  const [groupRequestsSent, setGroupRequestsSent] = useState([]);
  const [groupRequestsRemoved, setGroupRequestsRemoved] = useState([]);
  const [groupRequestsToApprove, setGroupRequestsToApprove] = useState([]);

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        dispatch(setFormLoading(true));
        const requests = await requestsAPI.getDirectConversationRequests(
          username!
        );
        setSendRequests(requests.sentRequestList);
        setReceivedRequests(requests.receivedRequestList);
        setRemovedRequests(requests.removedRequestList);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setFormLoading(false));
      }
    };

    getAllRequests();

    socket.on("addToDirectRequestList", ({ request }) => {
      addRequest(request, setReceivedRequests);
    });

    socket.on("removeDirectRequest", ({ from }) => {
      removeRequestFromRequested(from, setReceivedRequests);
    });

    socket.on("removeSentRequest", ({ id }) => {
      removeSentRequest(id, setSendRequests);
    });

    return () => {
      socket.off("addToDirectRequestList");
      socket.off("removeDirectRequest");
      socket.off("removeSentRequest");
    };
  }, []);

  const changeViewedRequests = useCallback(
    (requestType: requestType) => {
      setViewedRequests(requestType);
      setViewedTitleAndDesc(
        requestDesc.get(requestType) || defaultTitleAndDesc
      );
    },
    [viewedRequests]
  );

  const removeRequest = useCallback(async (request: sentRequestCard) => {
    let { unansweredRequests } =
      await requestsAPI.removeDirectConversationRequest(request.id);
    socket.emit("removeDirectRequest", {
      unansweredRequests,
      to: request.requestedUser,
    });

    let filteredSentRequests = sentRequests.filter((r) => {
      return r.id !== request.id;
    });
    setSendRequests(filteredSentRequests);
    setRemovedRequests((prev) => {
      return [...prev, request];
    });
  }, []);

  const resendRequest = useCallback(async (request: sentRequestCard) => {
    let { resentRequest, unansweredRequests } =
      await requestsAPI.resendDirectConversationRequest(request.id);
    socket.emit("addToDirectRequestList", {
      request: resentRequest,
      unansweredRequests,
      to: request.requestedUser,
    });

    let filteredRemovedRequests = removedRequests.filter((r) => {
      return r.id !== request.id;
    });
    setRemovedRequests(filteredRemovedRequests);
    setSendRequests((prev) => {
      return [...prev, request];
    });
  }, []);

  const respondToRequest = useCallback(
    async (response: directConversationResponse) => {
      let { requestResponse } =
        await requestsAPI.respondToDirectConversationRequest(response);
      if (requestResponse.conversation) {
        socket.emit("addConversation", {
          conversation: {
            ...requestResponse.conversation,
            unreadMessages: 0,
            otherUser: response.requestedUser,
          },
          to: response.requesterUser,
        });
      }

      removeRequestFromRequested(response.requesterUser, setReceivedRequests);
      dispatch(setUnansweredRequests(requestResponse.unansweredRequests));
      socket.emit("directResponse", {
        response: requestResponse,
        to: response.requesterUser,
      });
      socket.emit("updateUnansweredRequests", {
        unansweredRequests: requestResponse.unansweredRequests,
      });
    },
    []
  );

  return {
    viewedRequests,
    currentTitleAndDesc,
    sentRequests,
    receivedRequests,
    removedRequests,
    groupInvitations,
    groupRequestsReceived,
    groupRequestsSent,
    groupRequestsRemoved,
    groupRequestsToApprove,
    changeViewedRequests,
    removeRequest,
    resendRequest,
    respondToRequest,
  };
};

export default useRequestListPage;
