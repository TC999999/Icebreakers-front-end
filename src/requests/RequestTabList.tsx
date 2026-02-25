import RequestTab from "./RequestTab";
import type {
  requestCount,
  requestType,
  requestParams,
} from "../types/requestTypes";
import "../styles/requests/RequestTabList.scss";

type Props = {
  viewedRequests: requestType;
  requestCount: requestCount;
  changeViewedRequests: (params: requestParams) => Promise<void>;
  handleKeydown: (
    e: React.KeyboardEvent<Element>,
    requestType: requestType,
  ) => void;
};

// Reusable React component for tab list in request list page that separates requests of
// different categories
const RequestTabList: React.FC<Props> = ({
  viewedRequests,
  requestCount,
  changeViewedRequests,
  handleKeydown,
}) => {
  return (
    <div
      className="request-tabs"
      aria-label="Request Tabs"
      role="tablist"
      onKeyDown={(e) => handleKeydown(e, viewedRequests)}
    >
      <RequestTab
        key={"tab-1"}
        requestType="direct-requests-received"
        title="Received"
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
        key={"tab-2"}
        requestType="direct-requests-sent"
        title="Sent"
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
        key={"tab-3"}
        requestType="direct-requests-removed"
        title="Removed"
        viewedRequests={viewedRequests}
        params={{
          directOrGroup: "direct",
          requestOrInvitation: "requests",
          type: "removed",
        }}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.removedDirectRequestCount}
      />
      <RequestTab
        key={"tab-4"}
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
        key={"tab-5"}
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
        key={"tab-6"}
        requestType="group-requests-removed"
        title="Group Requests Removed"
        params={{
          directOrGroup: "group",
          requestOrInvitation: "requests",
          type: "removed",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.removedGroupRequestCount}
      />
      <RequestTab
        key={"tab-7"}
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
        key={"tab-8"}
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
      <RequestTab
        key={"tab-9"}
        requestType="group-invites-removed"
        title="Group Invitations Removed"
        params={{
          directOrGroup: "group",
          requestOrInvitation: "invitations",
          type: "removed",
        }}
        viewedRequests={viewedRequests}
        changeViewedRequests={changeViewedRequests}
        requestAmount={requestCount.removedGroupInvitationCount}
      />
    </div>
  );
};

export default RequestTabList;
