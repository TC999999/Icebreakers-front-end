// import { useCallback } from "react";
// import type {
//   sentRequestCard,
//   receivedRequestCard,
//   directConversationResponse,
// } from "../../types/requestTypes";
// import socket from "../../helpers/socket";

// type input = {
//   request: receivedRequestCard | sentRequestCard;
// };

// const useRequestCard = ({ request }: input) => {
//   const acceptRequest = useCallback(() => {
//     if ("requesterUser" in request) {
//       let response: directConversationResponse = {
//         id: request.id,
//         requesterUser: request.requesterUser,
//         accepted: true,
//       };

//       socket.emit("directResponse", { response, to: request.requesterUser });
//     }
//   }, []);

//   const declineRequest = useCallback(() => {
//     if ("requesterUser" in request) {
//       let response: directConversationResponse = {
//         id: request.id,
//         requesterUser: request.requesterUser,
//         accepted: false,
//       };
//       socket.emit("directResponse", { response, to: request.requesterUser });
//     }
//   }, []);

//   return { acceptRequest, declineRequest };
// };

// export default useRequestCard;
