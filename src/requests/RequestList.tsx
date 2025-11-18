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
  groupRequestResponse,
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
  removeDirectRequest: (request: sentRequestCard) => void;
  resendDirectRequest: (request: sentRequestCard) => void;
  respondToGroupRequest: (response: groupRequestResponse) => void;
  removeGroupRequest: (request: SentGroupCard) => void;
  resendGroupRequest: (request: SentGroupCard) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
  removeGroupInvitation: (request: SentGroupCard) => void;
  resendGroupInvitation: (request: SentGroupCard) => void;
};

// React Component with a list of Request Cards to be viewed in any of the the request inbox
const RequestList: React.FC<Props> = ({
  currentRequestType,
  currentTitleAndDesc,
  requestList,
  respondToDirectRequest,
  removeDirectRequest,
  resendDirectRequest,
  respondToGroupRequest,
  removeGroupRequest,
  resendGroupRequest,
  respondToGroupInvitation,
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
                removeDirectRequest={removeDirectRequest}
                resendDirectRequest={resendDirectRequest}
                respondToGroupRequest={respondToGroupRequest}
                removeGroupRequest={removeGroupRequest}
                resendGroupRequest={resendGroupRequest}
                respondToGroupInvitation={respondToGroupInvitation}
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
