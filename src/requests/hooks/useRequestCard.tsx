import { useCallback } from "react";
import type {
  RequestType,
  DirectConversationResponse,
  GroupConversationResponse,
  AnyRequest,
} from "../../types/requestTypes";

type input = {
  requestType: RequestType;
  request: AnyRequest;
  respondToDirectRequest: (response: DirectConversationResponse) => void;
  respondToGroupRequest: (response: GroupConversationResponse) => void;
  respondToGroupInvitation: (response: GroupConversationResponse) => void;
};

// custom hook for request card in list of requests in any tab in request inbox
const useRequestCard = ({
  requestType,
  request,
  respondToDirectRequest,
  respondToGroupRequest,
  respondToGroupInvitation,
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

  return { respond };
};

export default useRequestCard;
