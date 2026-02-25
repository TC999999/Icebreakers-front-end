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
  changeViewedRequests: (params: requestParams) => Promise<void>;
  toggleTabletTabs: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleKeydown: (
    e: React.KeyboardEvent<Element>,
    requestType: requestType,
  ) => void;
};

const RequestTabListTablet: React.FC<Props> = ({
  viewedRequests,
  requestCount,
  changeViewedRequests,
  toggleTabletTabs,
  handleKeydown,
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
        handleKeydown={handleKeydown}
      />
    </div>
  );
};

export default RequestTabListTablet;
