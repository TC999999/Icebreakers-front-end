import { type requestType } from "../../types/requestTypes";

type typeMap = {
  [key: string]: requestType;
};

type DoGMapType = {
  [key: string]: "direct" | "group";
};

type RoIMapType = {
  [key: string]: "requests" | "invitations";
};

type tMapType = {
  [key: string]: "received" | "sent" | "removed";
};

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

export const DoGMap: DoGMapType = {
  direct: "direct",
  group: "group",
};

export const RoIMap: RoIMapType = {
  requests: "requests",
  invitations: "invitations",
};

export const tMap: tMapType = {
  received: "received",
  sent: "sent",
  removed: "removed",
};
