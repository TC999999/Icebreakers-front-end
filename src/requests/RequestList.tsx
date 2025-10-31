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

type Props = {
  currentRequestType: requestType;
  currentTitleAndDesc: titleAndDesc;
  requestList: (
    | receivedRequestCard
    | sentRequestCard
    | ReceivedGroupCard
    | SentGroupCard
  )[];

  respondToDirectRequest: (response: directConversationResponse) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
  removeDirectRequest: (request: sentRequestCard) => void;
  resendDirectRequest: (request: sentRequestCard) => void;
  removeGroupRequest: (request: SentGroupCard) => void;
  removeGroupInvitation: (request: SentGroupCard) => void;
  resendGroupInvitation: (request: SentGroupCard) => void;
};

const RequestList: React.FC<Props> = ({
  currentRequestType,
  currentTitleAndDesc,
  requestList,
  respondToDirectRequest,
  respondToGroupInvitation,
  removeDirectRequest,
  removeGroupRequest,
  resendDirectRequest,
  removeGroupInvitation,
  resendGroupInvitation,
}): JSX.Element => {
  return (
    <div className="request-list">
      <header id="request-list-header">
        <h2>{currentTitleAndDesc.title}</h2>
        <p id="request-description">{currentTitleAndDesc.description}</p>
      </header>
      {requestList && requestList.length > 0 ? (
        <ul>
          {requestList.map((request) => (
            <li key={`request-${currentRequestType}-${request.id}`}>
              <RequestCard
                requestType={currentRequestType}
                request={request}
                respondToDirectRequest={respondToDirectRequest}
                respondToGroupInvitation={respondToGroupInvitation}
                removeDirectRequest={removeDirectRequest}
                removeGroupRequest={removeGroupRequest}
                resendDirectRequest={resendDirectRequest}
                removeGroupInvitation={removeGroupInvitation}
                resendGroupInvitation={resendGroupInvitation}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h3 className="message">This list is currently empty!</h3>
        </div>
      )}
    </div>
  );
};

export default RequestList;
