import React from "react";
import { type requestType } from "../types/requestTypes";
import "../styles/requests/RequestTab.scss";

type Props = {
  title: string;
  requestType: requestType;
  viewedRequests: requestType;
  changeViewedRequests: (requestType: requestType) => void;
  requestAmount: number;
};

const RequestTab: React.FC<Props> = ({
  title,
  requestType,
  viewedRequests,
  changeViewedRequests,
  requestAmount,
}) => {
  return (
    <div
      id={`${requestType}-request-tab`}
      className={`request-tab ${
        viewedRequests === requestType ? "selected-tab" : ""
      }`}
      onClick={() => changeViewedRequests(requestType)}
    >
      <span>{title}</span>{" "}
      {requestAmount > 0 && (
        <span>
          <b>({requestAmount})</b>
        </span>
      )}
    </div>
  );
};

export default RequestTab;
