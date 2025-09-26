import { type receivedRequest, type sentRequest } from "../types/requestTypes";
import { DateTime } from "luxon";
import "../styles/RequestCard.scss";

type Props = {
  request: receivedRequest | sentRequest;
};

const RequestCard: React.FC<Props> = ({ request }) => {
  let newDate = DateTime.fromISO(request.createdAt).toFormat(
    "LLLL d, yyyy 'at' h:mm a"
  );
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
      {"requesterUser" in request && (
        <div className="response-buttons">
          <button className="accept-button">Accept</button>
          <button className="decline-button">Decline</button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
