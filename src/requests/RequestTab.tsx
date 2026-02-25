import React from "react";
import type { requestType, requestParams } from "../types/requestTypes";
import "../styles/requests/RequestTab.scss";

type Props = {
  title: string;
  params: requestParams;
  requestType: requestType;
  viewedRequests: requestType;
  changeViewedRequests: (requestParams: requestParams) => void;
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
      tabIndex={viewedRequests === requestType ? 0 : -1}
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
