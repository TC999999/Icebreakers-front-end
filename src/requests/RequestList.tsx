import { type JSX } from "react";
import type { titleAndDesc } from "../types/miscTypes";
import type {
  sentRequestCard,
  receivedRequestCard,
  SentGroupCard,
  ReceivedGroupCard,
  directConversationResponse,
  requestType,
  groupConversationResponse,
  requestInfiniteQueryRes,
} from "../types/requestTypes";
import RequestCard from "./RequestCard";
import "../styles/requests/RequestList.scss";
import { IoReorderThree } from "react-icons/io5";
import RequestCardListSkeleton from "./skeletons/RequestCardListSkeleton";
import RequestCardSkeleton from "./skeletons/RequestCardSkeleton";
import IntersectionWrapper from "../IntersectionWrapper";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";

type Props = {
  currentRequestType: requestType;
  currentTitleAndDesc: titleAndDesc;
  requestList: (
    | receivedRequestCard
    | sentRequestCard
    | ReceivedGroupCard
    | SentGroupCard
  )[];
  isLoading: boolean;
  hasNextPage: boolean;
  toggleTabletTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  respondToDirectRequest: (response: directConversationResponse) => void;
  respondToGroupRequest: (response: groupConversationResponse) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<requestInfiniteQueryRes, unknown>,
      Error
    >
  >;
};

// React Component with a list of Request Cards to be viewed in any of the the request inbox
const RequestList: React.FC<Props> = ({
  currentRequestType,
  currentTitleAndDesc,
  requestList,
  isLoading,
  hasNextPage,
  toggleTabletTabs,
  respondToDirectRequest,
  respondToGroupRequest,
  respondToGroupInvitation,
  fetchNextPage,
}): JSX.Element => {
  return (
    <div className="request-list">
      <header id="request-list-header">
        <button
          type="button"
          className="tab-button"
          aria-label="changeViewedRequests"
          onClick={toggleTabletTabs}
        >
          <IoReorderThree />
        </button>
        <h2>{currentTitleAndDesc.title}</h2>
        <p id="request-description">{currentTitleAndDesc.description}</p>
      </header>

      <section id="request-list-window">
        {isLoading && !requestList && <RequestCardListSkeleton cards={3} />}
        {!isLoading && requestList && requestList.length > 0 && (
          <div id="request-card-list">
            {requestList.map((request) => (
              <RequestCard
                key={`request-${request.id}`}
                requestType={currentRequestType}
                request={request}
                respondToDirectRequest={respondToDirectRequest}
                respondToGroupRequest={respondToGroupRequest}
                respondToGroupInvitation={respondToGroupInvitation}
              />
            ))}
            <IntersectionWrapper
              fallback={<RequestCardSkeleton />}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        )}
        {!isLoading && requestList && requestList.length === 0 && (
          <div>
            <h3 className="message">This list is currently empty!</h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default RequestList;
