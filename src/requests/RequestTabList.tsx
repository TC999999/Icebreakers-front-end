import RequestTab from "./RequestTab";
import type {
  requestCount,
  requestType,
  requestParams,
} from "../types/requestTypes";
import "../styles/requests/RequestTabList.scss";
import useRequestTabList from "./hooks/useRequestTabList";

type Props = {
  viewedRequests: requestType;
  requestCount: requestCount;
  changeViewedRequests: (params: requestParams) => Promise<void>;
};

// Reusable React component for tab list in request list page that separates requests of
// different categories
const RequestTabList: React.FC<Props> = ({
  viewedRequests,
  requestCount,
  changeViewedRequests,
}) => {
  const { handleKeydown, handleBlur, handleMouseEnter } = useRequestTabList();
  return (
    <div
      className="request-tabs"
      aria-label="Request Tabs"
      role="tablist"
      tabIndex={0}
      onKeyDown={handleKeydown}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
    >
      <RequestTab
        key="tab-1"
        requestType="direct-requests-received"
        title="Direct Requests Received"
        params={{
          directOrGroup: "direct",
          requestOrInvitation: "requests",
          type: "received",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.receivedDirectRequestCount}
      />
      <RequestTab
        key="tab-2"
        requestType="direct-requests-sent"
        title="Direct Requests Sent"
        params={{
          directOrGroup: "direct",
          requestOrInvitation: "requests",
          type: "sent",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.sentDirectRequestCount}
      />
      <RequestTab
        key="tab-3"
        requestType="group-requests-received"
        title="Group Requests Received"
        params={{
          directOrGroup: "group",
          requestOrInvitation: "requests",
          type: "received",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.receivedGroupRequestCount}
      />
      <RequestTab
        key="tab-4"
        requestType="group-requests-sent"
        title="Group Requests Sent"
        params={{
          directOrGroup: "group",
          requestOrInvitation: "requests",
          type: "sent",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.sentGroupRequestCount}
      />
      <RequestTab
        key="tab-5"
        requestType="group-invites-received"
        title="Group Invitations Received"
        params={{
          directOrGroup: "group",
          requestOrInvitation: "invitations",
          type: "received",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.receivedGroupInvitationCount}
      />
      <RequestTab
        key="tab-6"
        requestType="group-invites-sent"
        title="Group Invitations Sent"
        params={{
          directOrGroup: "group",
          requestOrInvitation: "invitations",
          type: "sent",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.sentGroupInvitationCount}
      />
    </div>
  );
};

export default RequestTabList;
