import type {
  SentGroupCard,
  sentRequestCard,
  receivedRequestCard,
  ReceivedGroupCard,
  requestCount,
  directConversationResponse,
  groupRequestResponse,
  requestCountChange,
  groupConversationResponse,
} from "../types/requestTypes";

export type addOrRemove = "add" | "remove";

// updates request count state in request inbox component based on add and sub paramters in request
// change input
export const updateRequestCount = (
  requestChange: requestCountChange,
  requestCountSetter: React.Dispatch<React.SetStateAction<requestCount>>
) => {
  let add = requestChange.addRequest;
  let sub = requestChange.subtractRequest;

  if (add && !sub) {
    requestCountSetter((prev) => {
      return {
        ...prev,
        [add]: prev[add] + 1,
      };
    });
  } else if (!add && sub) {
    requestCountSetter((prev) => {
      return {
        ...prev,
        [sub]: prev[sub] - 1,
      };
    });
  } else if (add && sub) {
    requestCountSetter((prev) => ({
      ...prev,
      [add]: prev[add] + 1,
      [sub]: prev[sub] - 1,
    }));
  } else {
    requestCountSetter((prev) => {
      return {
        ...prev,
      };
    });
  }
};

// updates request list state in currently selected inbox to either add, remove, or both add and
// remove requests from inbox
export const updateSentRequests = (
  request:
    | sentRequestCard
    | receivedRequestCard
    | SentGroupCard
    | ReceivedGroupCard
    | directConversationResponse
    | groupConversationResponse
    | groupRequestResponse,
  addOrRemove: addOrRemove,
  requestListSetter: (
    value: React.SetStateAction<
      (
        | SentGroupCard
        | sentRequestCard
        | receivedRequestCard
        | ReceivedGroupCard
      )[]
    >
  ) => void
) => {
  if (addOrRemove === "add" && !("accepted" in request)) {
    requestListSetter((prev) => {
      return [request, ...prev];
    });
  } else {
    requestListSetter((prev) =>
      prev.filter((r) => {
        return r.id !== request.id;
      })
    );
  }
};
