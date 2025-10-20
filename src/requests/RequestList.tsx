import { type JSX } from "react";
import type {
  sentRequestCard,
  receivedRequestCard,
  directConversationResponse,
  requestType,
} from "../types/requestTypes";
import RequestCard from "./RequestCard";
import "../styles/requests/RequestList.scss";

type Props = {
  requestType: requestType;
  requestList: receivedRequestCard[] | sentRequestCard[];
  show: boolean;
  respondToRequest?: (response: directConversationResponse) => void;
  removeRequest?: (request: sentRequestCard) => void;
  resendRequest?: (request: sentRequestCard) => void;
};

const RequestList: React.FC<Props> = ({
  requestType,
  requestList,
  show,
  respondToRequest,
  removeRequest,
  resendRequest,
}): JSX.Element | null => {
  return show ? (
    <div className="request-list">
      {requestList && requestList.length > 0 ? (
        <div className="request-card-list">
          {requestList.map((request) => (
            <RequestCard
              key={`request-${requestType}-${request.id}`}
              requestType={requestType}
              request={request}
              respondToRequest={respondToRequest}
              removeRequest={removeRequest}
              resendRequest={resendRequest}
            />
          ))}
        </div>
      ) : (
        <div>
          <h3 className="message">This list is currently empty!</h3>
        </div>
      )}
    </div>
  ) : null;
};

export default RequestList;
