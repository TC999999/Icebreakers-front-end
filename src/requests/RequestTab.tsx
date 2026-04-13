import React from "react";
import type { RequestType, RequestParams } from "../types/requestTypes";
import "../styles/requests/RequestTab.scss";

type Props = {
  title: string;
  params: RequestParams;
  requestType: RequestType;
  viewedRequests: RequestType;
  changeViewedRequests: (requestParams: RequestParams) => void;
  requestAmount: number;
};

// reusable React Component for tabs that appear on the left-hand side of the request inbox component
const RequestTab: React.FC<Props> = ({
  title,
  params,
  requestType,
  viewedRequests,
  changeViewedRequests,
  requestAmount,
}) => {
  return (
    <div
      key={requestType}
      className={`request-tab ${
        viewedRequests === requestType ? "selected-tab" : ""
      }`}
      onClick={() => changeViewedRequests(params)}
      aria-selected={viewedRequests === requestType}
      role="tab"
    >
      <span>{title}</span>{" "}
      {requestAmount > 0 && (
        <span className="unread-request-counter">
          <b>{requestAmount}</b>
        </span>
      )}
    </div>
  );
};

export default RequestTab;
