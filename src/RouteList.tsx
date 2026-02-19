import { type JSX, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./home/HomePage";
import Error from "./Error";
const LogIn = lazy(() => import("./auth/LogIn"));
const SignUp = lazy(() => import("./auth/SignUp"));
const UserProfile = lazy(() => import("./users/UserProfile"));
const UserSearch = lazy(() => import("./users/UserSearch"));
const EditUser = lazy(() => import("./users/EditUser"));
const RequestPage = lazy(() => import("./requests/RequestPage"));
const RequestListPage = lazy(() => import("./requests/RequestListPage"));
const ConversationListPage = lazy(
  () => import("./conversations/ConversationListPage"),
);
const GroupList = lazy(() => import("./groups/GroupList"));
const CreateGroupForm = lazy(() => import("./groups/CreateGroupForm"));
const GroupPage = lazy(() => import("./groups/GroupPage"));
const GroupInvite = lazy(() => import("./groups/GroupInvite"));
const GroupSearchPage = lazy(() => import("./groups/GroupSearchPage"));
const GroupRequest = lazy(() => import("./groups/GroupRequest"));
const GroupConversationPage = lazy(
  () => import("./groupConversations/GroupConversationPage"),
);
const DeleteGroupMembers = lazy(() => import("./groups/DeleteGroupMembers"));
const BlockedUserPage = lazy(() => import("./blockUser/BlockedUserPage"));
import UserRoutes from "./routes/UserRoutes";
import LoggedOutRoutes from "./routes/LoggedOutRoutes";
import ErrorRoutes from "./routes/ErrorRoutes";
import LoadingLarge from "./LoadingLarge";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";

const RouteList = (): JSX.Element | null => {
  const location = useLocation();
  const loading: boolean = useAppSelector(
    (store) => store.loading.loadingInfo.pageLoading,
    shallowEqual,
  );

  return !loading ? (
    <Suspense fallback={<LoadingLarge lazy={true} />}>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<HomePage />} />
        <Route element={<LoggedOutRoutes />}>
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<SignUp />} />
        </Route>
        <Route element={<UserRoutes />}>
          <Route path="/user">
            <Route path=":username">
              <Route index element={<UserProfile />} />
              <Route path="edit" element={<EditUser />} />
              <Route path="blocked" element={<BlockedUserPage />} />
            </Route>
            <Route path="search" element={<UserSearch />} />
          </Route>
          <Route path="/request">
            <Route index element={<RequestListPage />} />
            <Route path=":to" element={<RequestPage />} />
          </Route>
          <Route path="/conversations">
            <Route index element={<ConversationListPage />} />
            <Route path="groups" element={<GroupConversationPage />} />
          </Route>
          <Route path="/groups">
            <Route index element={<GroupList />} />
            <Route path="search" element={<GroupSearchPage />} />
            <Route path="new" element={<CreateGroupForm />} />
            <Route path=":id">
              <Route index element={<GroupPage />} />
              <Route path="request" element={<GroupRequest />} />
              <Route path="delete" element={<DeleteGroupMembers />} />
            </Route>

            <Route path="invite/:to" element={<GroupInvite />} />
          </Route>
          <Route element={<ErrorRoutes />}>
            <Route path="/error" element={<Error />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={<Error error={{ status: 404, message: "Page Not Found" }} />}
        />
      </Routes>
    </Suspense>
  ) : null;
};

export default RouteList;
