import useRequestListPage from "./hooks/useRequestListPage";
import RequestList from "./RequestList";
import RequestTab from "./RequestTab";
import "../styles/RequestListPage.scss";

const RequestListPage = () => {
  const {
    sentRequests,
    receivedRequests,
    viewedRequests,
    currentTitleAndDesc,
    changeViewedRequests,
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
            requestType="received"
            title="Received"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="sent"
            title="Sent"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="removed"
            title="Removed"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="group-invites-received"
            title="Group Invitations"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="group-requests-received"
            title="Group Requests Received"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="group-requests-sent"
            title="Group Requests Sent"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="group-requests-removed"
            title="Group Requests Removed"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
          <RequestTab
            requestType="group-invites-to-approve"
            title="Group Invitations to Approve"
            viewedRequests={viewedRequests}
            changeViewedRequests={changeViewedRequests}
          />
        </div>
        <div id="request-list">
          <header id="request-list-header">
            <h2>{currentTitleAndDesc.title}</h2>
            <p id="request-description">{currentTitleAndDesc.description}</p>
          </header>
          <div id="requests">
            <RequestList
              requestList={receivedRequests}
              show={viewedRequests === "received"}
            />
            <RequestList
              requestList={sentRequests}
              show={viewedRequests === "sent"}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestListPage;
