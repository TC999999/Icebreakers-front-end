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

export type sentRequest = {
  requestedUser: string;
  content: string;
  createdAt: string;
};

export type sentRequestCard = {
  id: string;
  requestedUser: string;
  content: string;
  createdAt: string;
};

export type receivedRequest = {
  requesterUser: string;
  content: string;
  createdAt: string;
};

export type receivedRequestCard = {
  id: string;
  requesterUser: string;
  content: string;
  createdAt: string;
};

export type directRequestCard = {
  id: string;
  requesterUser: string;
  requestedUser: string;
  content: string;
  createdAt: string;
};

export type directConversationResponse = {
  id: string;
  requesterUser: string;
  requestedUser: string;
  accepted: boolean;
};

export type requestsList = {
  sentRequestList: sentRequestCard[];
  receivedRequestList: receivedRequestCard[];
  removedRequestList: sentRequestCard[];
};
