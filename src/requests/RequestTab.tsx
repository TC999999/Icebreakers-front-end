import React from "react";
import { type requestType } from "../types/requestTypes";
import "../styles/RequestTab.scss";

type Props = {
  title: string;
  requestType: requestType;
  viewedRequests: requestType;
  changeViewedRequests: (requestType: requestType) => void;
};

const RequestTab: React.FC<Props> = ({
  title,
  requestType,
  viewedRequests,
  changeViewedRequests,
}) => {
  return (
    <div
      id={`${requestType}-request-tab`}
      className={`request-tab ${
        viewedRequests === requestType ? "selected-tab" : ""
      }`}
      onClick={() => changeViewedRequests(requestType)}
    >
      {title}
    </div>
  );
};

export default RequestTab;
