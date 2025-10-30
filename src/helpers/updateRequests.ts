import type {
  SentGroupCard,
  sentRequestCard,
  receivedRequestCard,
  ReceivedGroupCard,
  requestCount,
  directConversationResponse,
  requestCountChange,
} from "../types/requestTypes";

export type addOrRemove = "add" | "remove";

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

export const updateSentRequests = (
  request:
    | sentRequestCard
    | receivedRequestCard
    | SentGroupCard
    | ReceivedGroupCard
    | directConversationResponse,
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
