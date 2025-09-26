import { type JSX } from "react";
import { type sentRequest, type receivedRequest } from "../types/requestTypes";
import RequestCard from "./RequestCard";
import "../styles/RequestList.scss";

type Props = {
  requestList: receivedRequest[] | sentRequest[];
  show: boolean;
};

const RequestList: React.FC<Props> = ({
  requestList,
  show,
}): JSX.Element | null => {
  return show ? (
    <div className="request-list">
      {requestList && requestList.length > 0 ? (
        <div className="request-card-list">
          {requestList.map((request) => (
            <RequestCard request={request} />
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
