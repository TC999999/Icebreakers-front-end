export type requestType =
  | "direct-requests-received"
  | "direct-requests-sent"
  | "group-invites-received"
  | "group-invites-sent"
  | "group-requests-received"
  | "group-requests-sent";

export type directConversationRequest = {
  to: string;
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

interface requestCard {
  id: string;
  content: string;
  createdAt: string;
  hasResponded: boolean;
  hasAccepted: boolean;
}

export interface sentRequestCard extends requestCard {
  to: string;
}

export type receivedRequest = {
  from: string;
  content: string;
  createdAt: string;
};

export interface receivedRequestCard extends requestCard {
  from: string;
}

export type directRequestCard = {
  id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
};

export type directConversationDelete = {
  to: string;
};

export type directConversationResponse = {
  id: string;
  from: string;
  accepted: boolean;
};

export type groupConversationResponse = {
  id: string;
  from: string;
  groupID: string;
  groupTitle: string;
  accepted: boolean;
};

export type groupInvitationDelete = {
  to: string;
  groupID: string;
};

export type groupRequestDelete = {
  groupID: string;
};

export type groupRequestResponse = {
  id: string;
  from: string;
  groupID: string;
  groupTitle: string;
  accepted: boolean;
};

export type requestParams = {
  directOrGroup: "direct" | "group";
  requestOrInvitation: "requests" | "invitations";
  type: "received" | "sent";
};

export type requestCountSTR =
  | "receivedDirectRequestCount"
  | "sentDirectRequestCount"
  | "receivedGroupInvitationCount"
  | "sentGroupInvitationCount"
  | "receivedGroupRequestCount"
  | "sentGroupRequestCount";

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
  next: boolean;
  hasResponded: boolean;
  hasAccepted: boolean;
}

export interface ReceivedGroupCard extends GroupCardTemplate {
  from: string;
}

export interface SentGroupCard extends GroupCardTemplate {
  to: string;
}

export type socketRequest = {
  requestType: requestType;
  to: string;
  request?: any;
  response?: any;
};

export type groupRequestFormData = {
  to: string;
  from: string;
  content: string;
};

export type requestList = (
  | sentRequestCard
  | receivedRequestCard
  | SentGroupCard
  | ReceivedGroupCard
)[];
export type requestSocketHookProps = {
  setNewRequestCount: () => void;
  refetchRequests: (id: string) => void;
  requestParams: requestParams;
};

export type requestInfiniteQueryRes = {
  requestList: requestList;
  next: boolean;
};

export type requestInfiniteQueryParams = { offset: number };
