import type {
  directConversationResponse,
  receivedRequestCard,
  sentRequestCard,
  requestType,
  SentGroupCard,
  ReceivedGroupCard,
  groupConversationResponse,
} from "../types/requestTypes";

import "../styles/requests/RequestCard.scss";
import createDate from "../helpers/createDate";
import useRequestCard from "./hooks/useRequestCard";

type Props = {
  requestType: requestType;
  request:
    | receivedRequestCard
    | sentRequestCard
    | SentGroupCard
    | ReceivedGroupCard;
  respondToDirectRequest: (response: directConversationResponse) => void;
  removeDirectRequest: (request: sentRequestCard) => void;
  resendDirectRequest: (request: sentRequestCard) => void;

  removeGroupRequest: (request: SentGroupCard) => void;
  resendGroupRequest: (request: SentGroupCard) => void;

  respondToGroupInvitation: (response: groupConversationResponse) => void;
  removeGroupInvitation: (request: SentGroupCard) => void;
  resendGroupInvitation: (request: SentGroupCard) => void;
};

const RequestCard: React.FC<Props> = ({
  requestType,
  request,
  respondToDirectRequest,
  removeDirectRequest,
  resendDirectRequest,

  removeGroupRequest,
  resendGroupRequest,
  respondToGroupInvitation,
  removeGroupInvitation,
  resendGroupInvitation,
}) => {
  const { respond, remove, resend } = useRequestCard({
    requestType,
    request,
    respondToDirectRequest,
    removeDirectRequest,
    resendDirectRequest,
    removeGroupRequest,
    resendGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    resendGroupInvitation,
  });

  return (
    <div className="request-card">
      <h2>
        {"from" in request
          ? `Request From ${request.from}`
          : `Request For ${request.to}`}
      </h2>

      {"groupTitle" in request && <h3>For Group: {request.groupTitle}</h3>}
      <div className="request-message">
        <p>{request.content}</p>
      </div>

      <div>
        <span>
          <small>Made At: {createDate(request.createdAt, "long")}</small>
        </span>
      </div>
      <div>
        <span>
          <small>
            Status: <b>Not Yet Responded</b>
          </small>
        </span>
      </div>

      <div id="response-list">
        {(requestType === "direct-requests-received" ||
          requestType === "group-invites-received") && (
          <div className="response-buttons" id="received-response">
            <button className="accept-button" onClick={() => respond(true)}>
              Accept
            </button>
            <button className="decline-button" onClick={() => respond(false)}>
              Decline
            </button>
          </div>
        )}
        {(requestType === "direct-requests-sent" ||
          requestType === "group-invites-sent" ||
          requestType === "group-requests-sent") && (
          <div className="response-buttons" id="sent-response">
            <button className="remove-button" onClick={() => remove()}>
              Remove
            </button>
          </div>
        )}

        {(requestType === "direct-requests-removed" ||
          requestType === "group-invites-removed" ||
          requestType === "group-requests-removed") && (
          <div className="response-buttons" id="removed-response">
            <button className="resend-button" onClick={() => resend()}>
              Resend
            </button>
            <button className="delete-button">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
