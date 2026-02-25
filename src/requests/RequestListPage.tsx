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
    isLoading,
    hasNextPage,
    changeViewedRequests,
    toggleTabletTabs,
    respondToDirectRequest,
    removeDirectRequest,
    deleteDirectRequest,
    respondToGroupRequest,
    removeGroupRequest,
    deleteGroupRequest,
    respondToGroupInvitation,
    removeGroupInvitation,
    deleteGroupInvitation,
    fetchNextPage,
    handleKeydown,
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
            handleKeydown={handleKeydown}
          />
        </Suspense>
      )}
      <div id="request-list-page">
        <RequestTabList
          viewedRequests={viewedRequests}
          requestCount={requestCount}
          changeViewedRequests={changeViewedRequests}
          handleKeydown={handleKeydown}
        />
        <RequestList
          currentRequestType={viewedRequests}
          currentTitleAndDesc={currentTitleAndDesc}
          requestList={requests}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          toggleTabletTabs={toggleTabletTabs}
          respondToDirectRequest={respondToDirectRequest}
          removeDirectRequest={removeDirectRequest}
          deleteDirectRequest={deleteDirectRequest}
          respondToGroupRequest={respondToGroupRequest}
          removeGroupRequest={removeGroupRequest}
          deleteGroupRequest={deleteGroupRequest}
          respondToGroupInvitation={respondToGroupInvitation}
          removeGroupInvitation={removeGroupInvitation}
          deleteGroupInvitation={deleteGroupInvitation}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </main>
  );
};

export default RequestListPage;
