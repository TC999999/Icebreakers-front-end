import type {
  directConversationResponse,
  receivedRequestCard,
  sentRequestCard,
  requestType,
} from "../types/requestTypes";
import "../styles/requests/RequestCard.scss";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import createDate from "../helpers/createDate";

type Props = {
  requestType: requestType;
  request: receivedRequestCard | sentRequestCard;
  respondToRequest?: (response: directConversationResponse) => void;
  removeRequest?: (request: sentRequestCard) => void;
  resendRequest?: (request: sentRequestCard) => void;
};

const RequestCard: React.FC<Props> = ({
  requestType,
  request,
  respondToRequest,
  removeRequest,
  resendRequest,
}) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  const respond = (accepted: boolean) => {
    if (respondToRequest && "requesterUser" in request) {
      respondToRequest({
        id: request.id,
        requesterUser: request.requesterUser,
        requestedUser: username!,
        accepted,
      });
    }
  };

  const remove = () => {
    if (removeRequest && "requestedUser" in request) {
      removeRequest(request);
    }
  };

  const resend = () => {
    if (resendRequest && "requestedUser" in request) {
      resendRequest(request);
    }
  };

  return (
    <div className="request-card">
      <h2>
        {"requesterUser" in request
          ? `Request From ${request.requesterUser}`
          : `Request For ${request.requestedUser}`}
      </h2>
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
        {requestType === "received" && (
          <div className="response-buttons" id="received-response">
            <button className="accept-button" onClick={() => respond(true)}>
              Accept
            </button>
            <button className="decline-button" onClick={() => respond(false)}>
              Decline
            </button>
          </div>
        )}
        {requestType === "sent" && (
          <div className="response-buttons" id="sent-response">
            <button className="remove-button" onClick={() => remove()}>
              Remove
            </button>
          </div>
        )}

        {requestType === "removed" && (
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
