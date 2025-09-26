import { type requestType } from "../../types/requestTypes";
import { type titleAndDesc } from "../../types/miscTypes";

const requestDesc = new Map<requestType, titleAndDesc>([
  [
    "received",
    {
      title: "Received Requests",
      description:
        "Requests that you have receieved from other users. You will be able to either accept their requests and start a new conversation with them, or decline their request.",
    },
  ],
  [
    "sent",
    {
      title: "Sent Requests",
      description:
        "Requests that you have sent to other users. Please be patient as they may not have seen your request yet. You will also be able to remove your request after you have sent it.",
    },
  ],
  [
    "removed",
    {
      title: "Removed Requests",
      description:
        "Requests that you have sent to other users, but removed afterwards. The recipient will not be able to see this request. You can either delete this request permanently, or resend it to the requested user.",
    },
  ],
  [
    "group-invites-received",
    {
      title: "Received Group Invitations",
      description:
        "Invitations from a group member to join a group. These invitations have already been approved by the group host.",
    },
  ],
  [
    "group-requests-received",
    {
      title: "Received Group Requests",
      description:
        "Requests that you have recieved from other users to join a group that you host. You will be able to either accept their requests and make them a group member, or decline their request.",
    },
  ],
  [
    "group-requests-sent",
    {
      title: "Sent Group Requests",
      description:
        "Requests that you have sent to a group host to join a group. Please be patient as they may not have seen your request yet. You will also be able to remove your request after you have sent it.",
    },
  ],
  [
    "group-requests-removed",
    {
      title: "Removed Group Requests",
      description:
        "Requests that you have sent to a group host to join a group, but removed afterwards. The host will not be able to see this request. You can either delete this request permanently, or resend it to the host.",
    },
  ],
  [
    "group-invites-to-approve",
    {
      title: "Group Invites to Approve",
      description:
        "Invitations sent by members of a group that you host that must be approved by you to be seen by the intended recepient.",
    },
  ],
]);

export default requestDesc;
