import { lazy, Suspense } from "react";
import useRequestListPage from "./hooks/useRequestListPage";
import RequestList from "./RequestList";
import RequestTabList from "./RequestTabList";
const RequestTabListTablet = lazy(() => import("./RequestTabListTablet"));
import "../styles/requests/RequestListPage.scss";
import LoadingSmall from "../LoadingSmall";

// React Component for Request inbox; contains tabs for all different categories for requests and
// a single list component that changes when the list in state changes
const RequestListPage = () => {
  const {
    viewedRequests,
    requests,
    requestCount,
    currentTitleAndDesc,
    showTabletRequestTabs,
    isFetching,
    hasNextPage,
    changeViewedRequests,
    toggleTabletTabs,
    respondToDirectRequest,
    respondToGroupRequest,
    respondToGroupInvitation,
    fetchNextPage,
  } = useRequestListPage();

  return (
    <main>
      <header>
        <h1 id="request-list-page-header">
          View and manage all requests you have received and sent.
        </h1>
      </header>

      {showTabletRequestTabs && (
        <Suspense fallback={<LoadingSmall lazy={true} />}>
          <RequestTabListTablet
            viewedRequests={viewedRequests}
            requestCount={requestCount}
            changeViewedRequests={changeViewedRequests}
            toggleTabletTabs={toggleTabletTabs}
          />
        </Suspense>
      )}
      <div id="request-list-page">
        <RequestTabList
          viewedRequests={viewedRequests}
          requestCount={requestCount}
          changeViewedRequests={changeViewedRequests}
        />
        <RequestList
          currentRequestType={viewedRequests}
          currentTitleAndDesc={currentTitleAndDesc}
          requestList={requests}
          isLoading={isFetching}
          hasNextPage={hasNextPage}
          toggleTabletTabs={toggleTabletTabs}
          respondToDirectRequest={respondToDirectRequest}
          respondToGroupRequest={respondToGroupRequest}
          respondToGroupInvitation={respondToGroupInvitation}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </main>
  );
};

export default RequestListPage;
