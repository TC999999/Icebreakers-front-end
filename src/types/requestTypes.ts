export type requestType =
  | "received"
  | "sent"
  | "removed"
  | "group-invites-received"
  | "group-requests-sent"
  | "group-requests-removed"
  | "group-requests-received"
  | "group-invites-to-approve";

export type directConversationRequest = {
  requestedUser: string;
  requesterUser: string;
  content: string;
};

export type directConversationRequestPair = {
  requestedUser: string;
  requesterUser: string;
};

export type directConversationRequestCard = {
  requestedUser: string;
  requesterUser: string;
  content: string;
  createdAt: string;
};

export type sentRequest = {
  requestedUser: string;
  content: string;
  createdAt: string;
};

export type receivedRequest = {
  requesterUser: string;
  content: string;
  createdAt: string;
};

export type requestsList = {
  sentRequestList: sentRequest[];
  receivedRequestList: receivedRequest[];
};
