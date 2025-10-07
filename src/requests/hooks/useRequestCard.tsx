import { useCallback } from "react";
import type {
  sentRequestCard,
  receivedRequestCard,
  directConversationResponse,
} from "../../types/requestTypes";
import socket from "../../helpers/socket";

type input = {
  request: receivedRequestCard | sentRequestCard;
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

  // const removeRequest = useCallback(() => {
  //   changeRequestSet(request)

  //   if ("requestedUser" in request) {
  //     socket.emit("removeDirectRequest", {
  //       to: request.requestedUser,
  //     });
  //   }
  // }, []);

  return { acceptRequest, declineRequest };
};

export default useRequestCard;
