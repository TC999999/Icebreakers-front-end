export type requestType =
  | "direct-requests-received"
  | "direct-requests-sent"
  | "direct-requests-removed"
  | "group-invites-received"
  | "group-invites-sent"
  | "group-invites-removed"
  | "group-requests-received"
  | "group-requests-sent"
  | "group-requests-removed";

export type directConversationRequest = {
  to: string;
  from: string;
  content: string;
};

export type directConversationRequestPair = {
  to: string;
  from: string;
};

export type sentRequest = {
  to: string;
  content: string;
  createdAt: string;
};

export type sentRequestCard = {
  id: string;
  to: string;
  content: string;
  createdAt: string;
};

export type receivedRequest = {
  from: string;
  content: string;
  createdAt: string;
};

export type receivedRequestCard = {
  id: string;
  from: string;
  content: string;
  createdAt: string;
};

export type directRequestCard = {
  id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
};

export type directConversationResponse = {
  id: string;
  from: string;
  to: string;
  accepted: boolean;
};

export type groupConversationResponse = {
  id: string;
  from: string;
  groupID: string;
  to: string;
  accepted: boolean;
};

export type groupRequestResponse = {
  id: string;
  from: string;
  groupID: string;
  accepted: boolean;
};

export type requestsList = {
  sentRequestList: sentRequestCard[];
  receivedRequestList: receivedRequestCard[];
  removedRequestList: sentRequestCard[];
};

export type requestParams = {
  directOrGroup: "direct" | "group";
  requestOrInvitation: "requests" | "invitations";
  type: "received" | "sent" | "removed";
};

export type requestCountSTR =
  | "receivedDirectRequestCount"
  | "sentDirectRequestCount"
  | "removedDirectRequestCount"
  | "receivedGroupInvitationCount"
  | "sentGroupInvitationCount"
  | "removedGroupInvitationCount"
  | "receivedGroupRequestCount"
  | "sentGroupRequestCount"
  | "removedGroupRequestCount";

export type requestCount = {
  [T in requestCountSTR]: number;
};

export type requestCountChange = {
  addRequest?: requestCountSTR;
  subtractRequest?: requestCountSTR;
};

// group cards
interface GroupCardTemplate {
  groupTitle: string;
  groupID: string;
  content: string;
  createdAt: string;
  id: string;
}

export interface ReceivedGroupCard extends GroupCardTemplate {
  from: string;
}

export interface SentGroupCard extends GroupCardTemplate {
  to: string;
}

export type socketRequest = {
  requestType: requestType;
  countType: requestCountSTR;
  to: string;
  request?: any;
  response?: any;
};

export type groupRequestFormData = {
  content: string;
};
