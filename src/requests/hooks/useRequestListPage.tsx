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
  socketRequest,
  groupConversationResponse,
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

// custom hook for request inbox page
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

  const [showTabletRequestTabs, setShowTabletRequestTabs] =
    useState<boolean>(false);

  // on initial render, gets url search query data and sets the initial selected request tab and
  // the initial header shown based on those params; also retrieves the initial request list to be
  // shown based on the search query and retrieves the count for each unanswered/sent/removed request
  // in each category
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

  //callback function to set new request count: to only be used in other functions
  const setNewRequestCount = (requestChange: requestCountChange) => {
    updateRequestCount(requestChange, setRequestCount);
  };

  // callback function that sets new requests in the current request list state
  const setNewRequests = (
    request:
      | SentGroupCard
      | ReceivedGroupCard
      | sentRequestCard
      | receivedRequestCard
      | directConversationResponse
      | groupConversationResponse,

    addOrRemove: addOrRemove
  ) => {
    updateSentRequests(request, addOrRemove, setCurrentRequests);
  };

  // reusable logic for updating request lists, setting the new count in state for request numbers,
  // and emitting socket signals
  const handleRequests = async (
    request:
      | sentRequestCard
      | receivedRequestCard
      | SentGroupCard
      | ReceivedGroupCard
      | directConversationResponse
      | groupConversationResponse,

    addOrRemove: addOrRemove,
    requestChange: requestCountChange,
    socketType: "addRequest" | "removeRequest" | "response",
    socketRequest: socketRequest
  ) => {
    setNewRequests(request, addOrRemove);
    setNewRequestCount(requestChange);
    socket.emit(socketType, socketRequest);
  };

  // sets up socket listeners on initial render
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
    [showTabletRequestTabs]
  );

  // when user clicks on respective request tab, highlights tab and sets description state to respective
  // text, and retrieves the correct request list from the backend database
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
      if (showTabletRequestTabs) setShowTabletRequestTabs(false);
    },
    [viewedRequests, showTabletRequestTabs]
  );

  // UPDATE DIRECT REQUESTS (SENDER'S SIDE ONLY)
  // removes request from recipient's inbox and moves it from senders sent request inbox
  // to their removed request inbox
  const removeDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      let resentRequest =
        await directRequestsAPI.removeDirectConversationRequest(
          request.id,
          username!,
          true
        );

      handleRequests(
        request,
        "remove",
        {
          addRequest: "removedDirectRequestCount",
          subtractRequest: "sentDirectRequestCount",
        },
        "removeRequest",
        {
          requestType: "direct-requests-received",
          countType: "receivedDirectRequestCount",
          to: request.to,
          request: resentRequest,
        }
      );
    },
    [currentRequests, requestCount]
  );

  // resend direct request to recipient's inbox
  const resendDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      let resentRequest =
        await directRequestsAPI.removeDirectConversationRequest(
          request.id,
          username!,
          false
        );

      handleRequests(
        request,
        "remove",
        {
          addRequest: "sentDirectRequestCount",
          subtractRequest: "removedDirectRequestCount",
        },
        "addRequest",
        {
          requestType: "direct-requests-received",
          countType: "receivedDirectRequestCount",
          to: request.to,
          request: resentRequest,
        }
      );
    },
    [currentRequests, requestCount]
  );

  // UPDATE GROUP REQUESTS (SENDER'S SIDE ONLY)
  // removes request from recipient's received group requests inbox and moves it from
  // senders sent group request inbox to their removed group request inbox
  const removeGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      const removedRequest = await groupRequestsAPI.removeRequest(
        request.id,
        username!,
        true
      );

      handleRequests(
        request,
        "remove",
        {
          addRequest: "removedGroupRequestCount",
          subtractRequest: "sentGroupRequestCount",
        },
        "removeRequest",
        {
          requestType: "group-requests-received",
          countType: "receivedGroupRequestCount",
          to: request.to,
          request: removedRequest,
        }
      );
    },
    [currentRequests, requestCount]
  );

  // removes a single request from the user's removed group requests inbox, moves it to their sent
  // group requests inbox, and sends request to its intended recipient via websocket
  const resendGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      const resentRequest = await groupRequestsAPI.removeRequest(
        request.id,
        username!,
        false
      );

      handleRequests(
        request,
        "remove",
        {
          addRequest: "sentGroupRequestCount",
          subtractRequest: "removedGroupRequestCount",
        },
        "addRequest",
        {
          requestType: "group-requests-received",
          countType: "receivedGroupRequestCount",
          to: request.to,
          request: resentRequest,
        }
      );
    },
    [currentRequests, requestCount]
  );

  // UPDATE GROUP INVITATIONS (SENDER'S SIDE ONLY)
  // removes invitation from recipient's sent group invitation inbox and moves it from
  // senders sent group invitation inbox to their removed group invitation inbox
  const removeGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      let invitation = await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        username!,
        true
      );

      handleRequests(
        request,
        "remove",
        {
          addRequest: "removedGroupInvitationCount",
          subtractRequest: "sentGroupInvitationCount",
        },
        "removeRequest",
        {
          requestType: "group-invites-received",
          countType: "receivedGroupInvitationCount",
          to: request.to,
          request: invitation,
        }
      );
    },
    [currentRequests, requestCount]
  );

  const resendGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      let invitation = await groupRequestsAPI.removeGroupConversationInvitation(
        request.id,
        username!,
        false
      );

      handleRequests(
        request,
        "remove",
        {
          addRequest: "sentGroupInvitationCount",
          subtractRequest: "removedGroupInvitationCount",
        },
        "addRequest",
        {
          requestType: "group-invites-received",
          countType: "receivedGroupInvitationCount",
          to: request.to,
          request: invitation,
        }
      );
    },
    [currentRequests, requestCount]
  );

  // DELETION (SENDER'S SIDE ONLY)
  // deletes direct request entirely from senders's inbox
  const deleteDirectRequest = useCallback(
    async (request: sentRequestCard) => {
      await directRequestsAPI.deleteDirectConversationRequest(
        request.id,
        username!,
        { to: request.to }
      );
      setNewRequests(request, "remove");
      setNewRequestCount({ subtractRequest: "removedDirectRequestCount" });
    },
    [currentRequests, requestCount]
  );

  // deletes group invitation entirely from senders's inbox
  const deleteGroupInvitation = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.deleteGroupConversationInvitation(
        request.id,
        username!,
        { to: request.to, groupID: request.groupID }
      );
      setNewRequests(request, "remove");
      setNewRequestCount({ subtractRequest: "removedGroupInvitationCount" });
    },
    [currentRequests, requestCount]
  );

  // deletes group request entirely from senders's inbox
  const deleteGroupRequest = useCallback(
    async (request: SentGroupCard) => {
      await groupRequestsAPI.deleteGroupRequest(request.id, username!, {
        groupID: request.groupID,
      });
      setNewRequests(request, "remove");
      setNewRequestCount({ subtractRequest: "removedGroupRequestCount" });
    },
    [currentRequests, requestCount]
  );

  // RESPONSES (RECIPIENT'S SIDE ONLY)
  // if request was accepted, the recipient join the group and
  // removes request from both users' inboxes
  const respondToDirectRequest = useCallback(
    async (response: directConversationResponse) => {
      let { requestResponse } =
        await directRequestsAPI.respondToDirectConversationRequest(
          username!,
          response
        );
      if (requestResponse.conversation) {
        socket.emit("addConversation", {
          conversation: {
            ...requestResponse.conversation,
            unreadMessages: 0,
            otherUser: username!,
          },
          to: response.from,
        });
      }

      handleRequests(
        response,
        "remove",
        {
          subtractRequest: "receivedDirectRequestCount",
        },
        "response",
        {
          to: response.from,
          requestType: "direct-requests-sent",
          countType: "sentDirectRequestCount",
          response,
        }
      );

      dispatch(setUnansweredRequests(-1));
    },
    [currentRequests, dispatch]
  );

  // if invitation was accepted, the recipient join the group and
  // removes invitation from both users' inboxes
  const respondToGroupInvitation = useCallback(
    async (response: groupConversationResponse) => {
      let res = await groupRequestsAPI.respondToGroupInvitation(
        username!,
        response
      );
      if (res.user) {
        socket.emit("addUserToGroup", {
          user: res.user,
          groupID: response.groupID,
        });
      }
      handleRequests(
        response,
        "remove",
        {
          subtractRequest: "receivedGroupInvitationCount",
        },
        "response",
        {
          to: response.from,
          requestType: "group-invites-sent",
          countType: "sentGroupInvitationCount",
          response,
        }
      );

      dispatch(setUnansweredRequests(-1));

      if (res.user) {
        socket.emit("joinGroup", { group: { id: response.groupID } });
      }
    },
    []
  );

  // if request was accepted, the sender join the group and removes
  // request from both users' inboxes
  const respondToGroupRequest = useCallback(
    async (response: groupConversationResponse) => {
      let res = await groupRequestsAPI.respondToGroupRequest(
        username!,
        response
      );
      if (res.user) {
        socket.emit("addUserToGroup", {
          user: res.user,
          groupID: response.groupID,
        });

        socket.emit("bringIntoGroup", {
          to: response.from,
          group: { id: response.groupID },
        });
      }
      handleRequests(
        response,
        "remove",
        {
          subtractRequest: "receivedGroupRequestCount",
        },
        "response",
        {
          to: response.from,
          requestType: "group-requests-sent",
          countType: "sentGroupRequestCount",
          response,
        }
      );

      dispatch(setUnansweredRequests(-1));
    },
    []
  );

  return {
    viewedRequests,
    currentTitleAndDesc,
    currentRequests,
    requestCount,
    showTabletRequestTabs,
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
