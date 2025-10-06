import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../features/hooks";
import { useAppDispatch } from "../../features/hooks";
import { type AppDispatch } from "../../features/store";
import { setFormLoading } from "../../features/slices/auth";
import requestsAPI from "../../apis/requestsAPI";
import {
  type sentRequest,
  type receivedRequest,
  type requestType,
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

  const [sentRequests, setSendRequests] = useState<sentRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<receivedRequest[]>(
    []
  );
  const [removedRequests, setRemovedRequests] = useState<sentRequest[]>([]);

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
      console.log("HELLO");
      addRequest(request, setReceivedRequests);
    });

    socket.on("remove direct request", ({ from }) => {
      removeRequestFromRequested(from, setReceivedRequests);
    });

    return () => {
      socket.off("addToDirectRequestList");
      socket.off("remove direct request");
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
  return {
    viewedRequests,
    currentTitleAndDesc,
    sentRequests,
    receivedRequests,
    removedRequests,
    changeViewedRequests,
  };
};

export default useRequestListPage;
