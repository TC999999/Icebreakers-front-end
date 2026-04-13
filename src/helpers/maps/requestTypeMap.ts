import type { RequestType, RequestCountSTR } from "../../types/requestTypes";

// initial dynamic object for setting up request type map
type typeMap = {
  [key: string]: RequestType;
};

type countMap = {
  [key: string]: RequestCountSTR;
};

// initial dynamic object for setting up direct-or-group map
type DoGMapType = {
  [key: string]: "direct" | "group";
};

// initial dynamic object for setting up requests-or-invitations map
type RoIMapType = {
  [key: string]: "requests" | "invitations";
};

// initial dynamic object for setting up type map
type tMapType = {
  [key: string]: "received" | "sent";
};

// map of request types as strings as keys to the corresponding type as an explicit requestType type
export const requestTypeMap: typeMap = {
  "direct-requests-received": "direct-requests-received",
  "direct-requests-sent": "direct-requests-sent",
  "group-invitations-received": "group-invites-received",
  "group-invitations-sent": "group-invites-sent",
  "group-requests-received": "group-requests-received",
  "group-requests-sent": "group-requests-sent",
};

// map of request types as strings as keys to the corresponding type as an explicit RequestCountStr type
export const requestCountMap: countMap = {
  "direct-requests-received": "receivedDirectRequestCount",
  "direct-requests-sent": "sentDirectRequestCount",
  "group-invitations-received": "receivedGroupInvitationCount",
  "group-invitations-sent": "sentGroupInvitationCount",
  "group-requests-received": "receivedGroupRequestCount",
  "group-requests-sent": "sentGroupRequestCount",
};

// map for direct-or-group parameters: strings as keys to the corresponding type as an
// explicit string type
export const DoGMap: DoGMapType = {
  direct: "direct",
  group: "group",
};

// map for request-or-invitation parameters: strings as keys to the corresponding type as an
// explicit string type
export const RoIMap: RoIMapType = {
  requests: "requests",
  invitations: "invitations",
};

// map for type parameters: strings as keys to the corresponding type as an explicit string type
export const tMap: tMapType = {
  received: "received",
  sent: "sent",
};
