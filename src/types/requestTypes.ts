export type RequestType =
  | "direct-requests-received"
  | "direct-requests-sent"
  | "group-invites-received"
  | "group-invites-sent"
  | "group-requests-received"
  | "group-requests-sent";

// DIRECT REQUEST FORM DATA
export type DirectConversationRequest = {
  to: string;
  content: string;
};

export type DirectConversationRequestPair = {
  to: string;
  from: string;
};

// GROUP REQUEST FORM DATA
export type GroupRequestFormData = {
  to: string;
  from: string;
  content: string;
};

// BASE/DIRECT REQUEST CARD
interface RequestCard {
  id: string;
  content: string;
  createdAt: string;
}

export interface ReceivedRequestCard extends RequestCard {
  from: string;
}

export interface SentRequestCard extends RequestCard {
  to: string;
}

// GROUP REQUEST CARDS
interface BaseGroupRequestCard {
  groupID: string;
  groupTitle: string;
}
export interface ReceivedGroupRequestCard
  extends BaseGroupRequestCard, ReceivedRequestCard {}

export interface SentGroupRequestCard
  extends BaseGroupRequestCard, SentRequestCard {}

// REQUEST RESPONSES
export interface DirectConversationResponse {
  id: string;
  from: string;
  accepted: boolean;
}

export interface GroupConversationResponse extends DirectConversationResponse {
  groupID: string;
  groupTitle: string;
}

// MAYBE DELETE

export type DirectConversationDelete = {
  to: string;
};

export type groupInvitationDelete = {
  to: string;
  groupID: string;
};

export type groupRequestDelete = {
  groupID: string;
};

// END MAYBE DELETE

export type RequestParams = {
  directOrGroup: "direct" | "group";
  requestOrInvitation: "requests" | "invitations";
  type: "received" | "sent";
};

export type RequestCountSTR =
  | "receivedDirectRequestCount"
  | "sentDirectRequestCount"
  | "receivedGroupInvitationCount"
  | "sentGroupInvitationCount"
  | "receivedGroupRequestCount"
  | "sentGroupRequestCount";

export type RequestCount = {
  [T in RequestCountSTR]: number;
};

export type SocketRequest = {
  requestType: RequestType;
  to: string;
  request?: any;
  response?: any;
};

export type AnyRequest =
  | SentRequestCard
  | ReceivedRequestCard
  | SentGroupRequestCard
  | ReceivedGroupRequestCard;

export type RequestList = AnyRequest[];

export type RequestSocketHookProps = {
  setNewRequestCount: (requestType: RequestCountSTR) => void;
  refetchRequests: (id: string) => void;
  requestParams: RequestParams;
};

export type RequestInfiniteQueryRes = {
  requestList: RequestList;
  next: boolean;
};

export type RequestInfiniteQueryParams = { offset: number };
