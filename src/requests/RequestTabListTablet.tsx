import React from "react";

import RequestTabList from "./RequestTabList";
import type {
  requestType,
  requestCount,
  requestParams,
} from "../types/requestTypes";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  viewedRequests: requestType;
  requestCount: requestCount;
  changeViewedRequests: (
    requestType: requestType,
    params: requestParams
  ) => Promise<void>;
  toggleTabletTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  show: boolean;
};

const RequestTabListTablet: React.FC<Props> = ({
  viewedRequests,
  requestCount,
  changeViewedRequests,
  toggleTabletTabs,
  show,
}) => {
  return show ? (
    <div className="modal-transparent" id="tab-list-tablet">
      <div>
        <button
          type="button"
          title="Cancel"
          className="cancel-button"
          onClick={toggleTabletTabs}
        >
          <FaArrowLeft />
        </button>
      </div>
      <RequestTabList
        viewedRequests={viewedRequests}
        requestCount={requestCount}
        changeViewedRequests={changeViewedRequests}
      />
    </div>
  ) : null;
};

export default RequestTabListTablet;
