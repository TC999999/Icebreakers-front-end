import {
  type receivedRequest,
  type sentRequest,
  type requestType,
} from "../types/requestTypes";
import { DateTime } from "luxon";
import "../styles/RequestCard.scss";
import useRequestCard from "./hooks/useRequestCard";

type Props = {
  requestType: requestType;
  request: receivedRequest | sentRequest;
};

const RequestCard: React.FC<Props> = ({ requestType, request }) => {
  let newDate = DateTime.fromISO(request.createdAt).toFormat(
    "LLLL d, yyyy 'at' h:mm a"
  );

  const { acceptRequest, declineRequest, removeRequest } = useRequestCard({
    request,
  });
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
          <small>Made At: {newDate}</small>
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
            <button className="accept-button" onClick={() => acceptRequest()}>
              Accept
            </button>
            <button className="decline-button" onClick={() => declineRequest()}>
              Decline
            </button>
          </div>
        )}
        {requestType === "sent" && (
          <div className="response-buttons" id="sent-response">
            <button className="remove-button" onClick={() => removeRequest()}>
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
