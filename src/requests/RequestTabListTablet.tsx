import RequestTabList from "./RequestTabList";
import type {
  RequestType,
  RequestCount,
  RequestParams,
} from "../types/requestTypes";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  viewedRequests: RequestType;
  requestCount: RequestCount;
  changeViewedRequests: (params: RequestParams) => Promise<void>;
  toggleTabletTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

const RequestTabListTablet: React.FC<Props> = ({
  viewedRequests,
  requestCount,
  changeViewedRequests,
  toggleTabletTabs,
}) => {
  return (
    <div className="modal-transparent" id="tab-list-tablet">
      <div>
        <button
          type="button"
          title="Cancel"
          className="cancel-button"
          aria-label="Cancel and Go Back"
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
  );
};

export default RequestTabListTablet;
