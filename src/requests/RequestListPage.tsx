import useRequestListPage from "./hooks/useRequestListPage";
import RequestList from "./RequestList";
import RequestTab from "./RequestTab";
import "../styles/requests/RequestListPage.scss";

const RequestListPage = () => {
  const {
    viewedRequests,
    currentRequests,
    requestCount,
    currentTitleAndDesc,
    changeViewedRequests,
    respondToDirectRequest,
    removeDirectRequest,
    resendDirectRequest,
    respondToGroupRequest,
    removeGroupRequest,
    resendGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    resendGroupInvitation,
  } = useRequestListPage();

  return (
    <main>
      <header>
        <h1 id="request-list-page-header">
          View and manage all requests you have received and sent.
        </h1>
      </header>
      <div id="request-list-page">
        <div id="request-tabs">
          <RequestTab
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

        <RequestList
          currentRequestType={viewedRequests}
          currentTitleAndDesc={currentTitleAndDesc}
          requestList={currentRequests}
          respondToDirectRequest={respondToDirectRequest}
          removeDirectRequest={removeDirectRequest}
          resendDirectRequest={resendDirectRequest}
          respondToGroupRequest={respondToGroupRequest}
          removeGroupRequest={removeGroupRequest}
          resendGroupRequest={resendGroupRequest}
          respondToGroupInvitation={respondToGroupInvitation}
          removeGroupInvitation={removeGroupInvitation}
          resendGroupInvitation={resendGroupInvitation}
        />
      </div>
    </main>
  );
};

export default RequestListPage;
