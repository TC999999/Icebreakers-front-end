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
  respondToGroupRequest: (response: groupConversationResponse) => void;
  respondToGroupInvitation: (response: groupConversationResponse) => void;
};

// reusable React component for request cards that show up in the user's request inbox; can ue used
// for any type of request (direct requests, group requests, or group invitations), shows different
// buttons depending on if the request was received, sent out, or removed from the other user's view
const RequestCard: React.FC<Props> = ({
  requestType,
  request,
  respondToDirectRequest,
  respondToGroupRequest,
  respondToGroupInvitation,
}) => {
  const { respond } = useRequestCard({
    requestType,
    request,
    respondToDirectRequest,
    respondToGroupRequest,
    respondToGroupInvitation,
  });

  return (
    <div className="request-card">
      {requestType === "group-invites-received" ||
      requestType === "group-invites-sent" ? (
        <h2>
          {"from" in request
            ? `Invitation From ${request.from}`
            : `Invitation For ${request.to}`}
        </h2>
      ) : (
        <h2>
          {"from" in request
            ? `Request From ${request.from}`
            : `Request For ${request.to}`}
        </h2>
      )}

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
            Status:{" "}
            {!request.hasResponded && !request.hasAccepted && (
              <b>Not Yet Responded</b>
            )}
            {request.hasResponded && request.hasAccepted && (
              <b>Request Accepted</b>
            )}
            {request.hasResponded && !request.hasAccepted && (
              <b>Request Declined</b>
            )}
          </small>
        </span>
      </div>
      {!request.hasResponded && (
        <div id="response-list">
          {(requestType === "direct-requests-received" ||
            requestType === "group-invites-received" ||
            requestType === "group-requests-received") && (
            <div className="response-buttons" id="received-response">
              <button className="accept-button" onClick={() => respond(true)}>
                Accept
              </button>
              <button className="decline-button" onClick={() => respond(false)}>
                Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;
