import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import requestsAPI from "../../apis/requestsAPI";
import type {
  sentRequestCard,
  receivedRequestCard,
  requestType,
} from "../../types/requestTypes";
import requestDesc from "../../helpers/maps/requestList";
import { type titleAndDesc } from "../../types/miscTypes";
import removeRequestFromRequested from "../../helpers/removeRequest";
import addRequest from "../../helpers/addRequest";
import socket from "../../helpers/socket";

const useRequestListPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  });

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

    return () => {
      socket.off("addToDirectRequestList");
      socket.off("removeDirectRequest");
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

  return {
    viewedRequests,
    currentTitleAndDesc,
    sentRequests,
    receivedRequests,
    removedRequests,
    changeViewedRequests,
    removeRequest,
    resendRequest,
  };
};

export default useRequestListPage;
