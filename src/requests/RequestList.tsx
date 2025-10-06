import { type JSX } from "react";
import {
  type sentRequest,
  type receivedRequest,
  type requestType,
} from "../types/requestTypes";
import RequestCard from "./RequestCard";
import "../styles/RequestList.scss";

type Props = {
  requestType: requestType;
  requestList: receivedRequest[] | sentRequest[];
  show: boolean;
};

const RequestList: React.FC<Props> = ({
  requestType,
  requestList,
  show,
}): JSX.Element | null => {
  return show ? (
    <div className="request-list">
      {requestList && requestList.length > 0 ? (
        <div className="request-card-list">
          {requestList.map((request, i) => (
            <RequestCard
              key={`request-${requestType}-${i}`}
              requestType={requestType}
              request={request}
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
