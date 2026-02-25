import type { requestType, requestTab } from "../../types/requestTypes";

const requestTabs = new Map<requestType, requestTab>([
  [
    "direct-requests-received",
    {
      params: {
        directOrGroup: "direct",
        requestOrInvitation: "requests",
        type: "received",
      },
      prev: "group-invites-removed",
      next: "direct-requests-sent",
    },
  ],
  [
    "direct-requests-sent",
    {
      params: {
        directOrGroup: "direct",
        requestOrInvitation: "requests",
        type: "sent",
      },
      prev: "direct-requests-received",
      next: "direct-requests-removed",
    },
  ],
  [
    "direct-requests-removed",
    {
      params: {
        directOrGroup: "direct",
        requestOrInvitation: "requests",
        type: "removed",
      },
      prev: "direct-requests-sent",
      next: "group-requests-received",
    },
  ],
  [
    "group-requests-received",
    {
      params: {
        directOrGroup: "group",
        requestOrInvitation: "requests",
        type: "received",
      },
      prev: "direct-requests-removed",
      next: "group-requests-sent",
    },
  ],
  [
    "group-requests-sent",
    {
      params: {
        directOrGroup: "group",
        requestOrInvitation: "requests",
        type: "sent",
      },
      prev: "group-requests-received",
      next: "group-requests-removed",
    },
  ],
  [
    "group-requests-removed",
    {
      params: {
        directOrGroup: "group",
        requestOrInvitation: "requests",
        type: "removed",
      },
      prev: "group-requests-sent",
      next: "group-invites-received",
    },
  ],

  [
    "group-invites-received",
    {
      params: {
        directOrGroup: "group",
        requestOrInvitation: "invitations",
        type: "received",
      },
      prev: "group-requests-removed",
      next: "group-invites-sent",
    },
  ],
  [
    "group-invites-sent",
    {
      params: {
        directOrGroup: "group",
        requestOrInvitation: "invitations",
        type: "sent",
      },
      prev: "group-invites-received",
      next: "group-invites-removed",
    },
  ],
  [
    "group-invites-removed",
    {
      params: {
        directOrGroup: "group",
        requestOrInvitation: "invitations",
        type: "removed",
      },
      prev: "group-invites-sent",
      next: "direct-requests-received",
    },
  ],
]);

export default requestTabs;
