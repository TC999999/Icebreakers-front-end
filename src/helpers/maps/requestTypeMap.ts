import { type requestType } from "../../types/requestTypes";

// initial dynamic object for setting up request type map
type typeMap = {
  [key: string]: requestType;
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
  [key: string]: "received" | "sent" | "removed";
};

// map of request types as strings as keys to the corresponding type as an explicit requestType type
export const requestTypeMap: typeMap = {
  "direct-requests-received": "direct-requests-received",
  "direct-requests-sent": "direct-requests-sent",
  "direct-requests-removed": "direct-requests-removed",

  "group-invitations-received": "group-invites-received",
  "group-invitations-sent": "group-invites-sent",
  "group-invitations-removed": "group-invites-removed",

  "group-requests-received": "group-requests-received",
  "group-requests-sent": "group-requests-sent",
  "group-requests-removed": "group-requests-removed",
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
  removed: "removed",
};
