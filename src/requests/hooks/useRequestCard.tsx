import { useCallback } from "react";
import type {
  directConversationResponse,
  groupConversationResponse,
  receivedRequestCard,
  sentRequestCard,
  requestType,
  SentGroupCard,
  ReceivedGroupCard,
} from "../../types/requestTypes";

type input = {
  requestType: requestType;
  request:
    | receivedRequestCard
    | sentRequestCard
    | SentGroupCard
    | ReceivedGroupCard;
  respondToDirectRequest: (response: directConversationResponse) => void;
  respondToGroupRequest: (response: groupConversationResponse) => void;
  removeGroupRequest: (request: SentGroupCard) => void;
  deleteGroupRequest: (request: SentGroupCard) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
  removeGroupInvitation: (request: SentGroupCard) => void;
  deleteGroupInvitation: (request: SentGroupCard) => void;
};

// custom hook for request card in list of requests in any tab in request inbox
const useRequestCard = ({
  requestType,
  request,
  respondToDirectRequest,
  respondToGroupRequest,
  removeGroupRequest,
  deleteGroupRequest,
  respondToGroupInvitation,
  removeGroupInvitation,
  deleteGroupInvitation,
}: input) => {
  // callback function that allows user to respond to the requests that they have received; works for
  // both acceptance and denial
  const respond = useCallback((accepted: boolean) => {
    if (
      "from" in request &&
      !("groupID" in request) &&
      requestType === "direct-requests-received"
    ) {
      respondToDirectRequest({
        id: request.id,
        from: request.from,
        accepted,
      });
    } else if (
      "from" in request &&
      "groupID" in request &&
      requestType === "group-invites-received"
    ) {
      respondToGroupInvitation({
        id: request.id,
        from: request.from,
        groupID: request.groupID,
        groupTitle: request.groupTitle,
        accepted,
      });
    } else if (
      "from" in request &&
      "groupID" in request &&
      requestType === "group-requests-received"
    ) {
      respondToGroupRequest({
        id: request.id,
        from: request.from,
        groupID: request.groupID,
        groupTitle: request.groupTitle,
        accepted,
      });
    }
  }, []);

  // callback function that allows user to remove the requests that they have sent to other users
  const remove = useCallback(() => {
    if (
      "to" in request &&
      "groupID" in request &&
      requestType === "group-requests-sent"
    ) {
      removeGroupRequest(request);
    } else if (
      "to" in request &&
      "groupID" in request &&
      requestType === "group-invites-sent"
    ) {
      removeGroupInvitation(request);
    }
  }, []);

  // callback function that allows user to remove the requests that they have sent to other users
  const deleteRequest = useCallback(() => {
    if (
      "to" in request &&
      "groupID" in request &&
      requestType === "group-requests-removed"
    ) {
      deleteGroupRequest(request);
    } else if (
      "to" in request &&
      "groupID" in request &&
      requestType === "group-invites-removed"
    ) {
      deleteGroupInvitation(request);
    }
  }, []);

  return { respond, remove, deleteRequest };
};

export default useRequestCard;
