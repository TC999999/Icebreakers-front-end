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
import { useAppSelector } from "../../features/hooks";
import { shallowEqual } from "react-redux";

type input = {
  requestType: requestType;
  request:
    | receivedRequestCard
    | sentRequestCard
    | SentGroupCard
    | ReceivedGroupCard;
  respondToDirectRequest: (response: directConversationResponse) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
  removeDirectRequest: (request: sentRequestCard) => void;
  resendDirectRequest: (request: sentRequestCard) => void;
  removeGroupRequest: (request: SentGroupCard) => void;
  removeGroupInvitation: (request: SentGroupCard) => void;
  resendGroupInvitation: (request: SentGroupCard) => void;
};

const useRequestCard = ({
  requestType,
  request,
  respondToDirectRequest,
  respondToGroupInvitation,
  removeDirectRequest,
  resendDirectRequest,
  removeGroupRequest,
  removeGroupInvitation,
  resendGroupInvitation,
}: input) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const respond = useCallback((accepted: boolean) => {
    if (
      "from" in request &&
      !("groupID" in request) &&
      requestType === "direct-requests-received"
    ) {
      respondToDirectRequest({
        id: request.id,
        from: request.from,
        to: username!,
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
        to: username!,
        groupID: request.groupID,
        accepted,
      });
    }
  }, []);

  const remove = useCallback(() => {
    if (
      "to" in request &&
      !("groupID" in request) &&
      requestType === "direct-requests-sent"
    ) {
      removeDirectRequest(request);
    } else if (
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

  const resend = useCallback(() => {
    if (
      "to" in request &&
      !("groupID" in request) &&
      requestType === "direct-requests-removed"
    ) {
      resendDirectRequest(request);
    }
    if (
      "to" in request &&
      "groupID" in request &&
      requestType === "group-invites-removed"
    ) {
      resendGroupInvitation(request);
    }
  }, []);

  return { respond, remove, resend };
};

export default useRequestCard;
