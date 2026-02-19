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
} from "../types/requestTypes";
import RequestCard from "./RequestCard";
import "../styles/requests/RequestList.scss";
import { IoReorderThree } from "react-icons/io5";
import RequestCardListSkeleton from "./skeletons/RequestCardListSkeleton";

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
  toggleTabletTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  respondToDirectRequest: (response: directConversationResponse) => void;
  removeDirectRequest: (request: sentRequestCard) => void;
  resendDirectRequest: (request: sentRequestCard) => void;
  deleteDirectRequest: (request: sentRequestCard) => void;
  respondToGroupRequest: (response: groupConversationResponse) => void;
  removeGroupRequest: (request: SentGroupCard) => void;
  resendGroupRequest: (request: SentGroupCard) => void;
  deleteGroupRequest: (request: SentGroupCard) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
  removeGroupInvitation: (request: SentGroupCard) => void;
  resendGroupInvitation: (request: SentGroupCard) => void;
  deleteGroupInvitation: (request: SentGroupCard) => void;
};

// React Component with a list of Request Cards to be viewed in any of the the request inbox
const RequestList: React.FC<Props> = ({
  currentRequestType,
  currentTitleAndDesc,
  requestList,
  isLoading,
  toggleTabletTabs,
  respondToDirectRequest,
  removeDirectRequest,
  resendDirectRequest,
  deleteDirectRequest,
  respondToGroupRequest,
  removeGroupRequest,
  resendGroupRequest,
  deleteGroupRequest,
  respondToGroupInvitation,
  removeGroupInvitation,
  resendGroupInvitation,
  deleteGroupInvitation,
}): JSX.Element => {
  return (
    <div className="request-list">
      <header id="request-list-header">
        <button
          title="Change Request Category"
          type="button"
          className="tab-button"
          onClick={toggleTabletTabs}
        >
          <IoReorderThree />
        </button>
        <h2>{currentTitleAndDesc.title}</h2>
        <p id="request-description">{currentTitleAndDesc.description}</p>
      </header>

      <section id="request-card-list">
        {isLoading && !requestList && <RequestCardListSkeleton cards={3} />}
        {!isLoading &&
          requestList &&
          requestList.length > 0 &&
          requestList.map((request) => (
            <RequestCard
              key={`request-${request.id}`}
              requestType={currentRequestType}
              request={request}
              respondToDirectRequest={respondToDirectRequest}
              removeDirectRequest={removeDirectRequest}
              resendDirectRequest={resendDirectRequest}
              deleteDirectRequest={deleteDirectRequest}
              respondToGroupRequest={respondToGroupRequest}
              removeGroupRequest={removeGroupRequest}
              resendGroupRequest={resendGroupRequest}
              deleteGroupRequest={deleteGroupRequest}
              respondToGroupInvitation={respondToGroupInvitation}
              removeGroupInvitation={removeGroupInvitation}
              resendGroupInvitation={resendGroupInvitation}
              deleteGroupInvitation={deleteGroupInvitation}
            />
          ))}

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
