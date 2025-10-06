import { useCallback } from "react";
import type {
  sentRequest,
  receivedRequest,
  directConversationResponse,
} from "../../types/requestTypes";
import socket from "../../helpers/socket";

type input = {
  request: receivedRequest | sentRequest;
};

const useRequestCard = ({ request }: input) => {
  const acceptRequest = useCallback(() => {
    if ("requesterUser" in request) {
      let response: directConversationResponse = {
        requesterUser: request.requesterUser,
        acccpted: true,
      };
      socket.emit("direct response", { response, to: request.requesterUser });
    }
  }, []);

  const declineRequest = useCallback(() => {
    if ("requesterUser" in request) {
      let response: directConversationResponse = {
        requesterUser: request.requesterUser,
        acccpted: false,
      };
      socket.emit("direct response", { response, to: request.requesterUser });
    }
  }, []);

  const removeRequest = useCallback(() => {
    if ("requestedUser" in request) {
      socket.emit("remove direct request", {
        to: request.requestedUser,
      });
    }
  }, []);

  return { acceptRequest, declineRequest, removeRequest };
};

export default useRequestCard;
