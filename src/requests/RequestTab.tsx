import React from "react";
import type { requestType, requestParams } from "../types/requestTypes";
import "../styles/requests/RequestTab.scss";

type Props = {
  title: string;
  params: requestParams;
  requestType: requestType;
  viewedRequests: requestType;
  changeViewedRequests: (
    requestType: requestType,
    requestParams: requestParams
  ) => void;
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
      id={`${requestType}-request-tab`}
      className={`request-tab ${
        viewedRequests === requestType ? "selected-tab" : ""
      }`}
      onClick={() => changeViewedRequests(requestType, params)}
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
