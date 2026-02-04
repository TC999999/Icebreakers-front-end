import { type JSX } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LogIn from "./auth/LogIn";
// const LogIn = lazy(() => import("./auth/LogIn"));
import SignUp from "./auth/SignUp";
// const SignUp = lazy(() => import("./auth/SignUp"));
import HomePage from "./home/HomePage";
// const HomePage = lazy(() => import("./home/HomePage"));
import NotFound from "./NotFound";
// const NotFound = lazy(() => import("./NotFound"));
import Error from "./Error";
// const Error = lazy(() => import("./Error"));
import UserProfile from "./users/UserProfile";
// const UserProfile = lazy(() => import("./users/UserProfile"));
import UserSearch from "./users/UserSearch";
// const UserSearch = lazy(() => import("./users/UserSearch"));
import EditUser from "./users/EditUser";
// const EditUser = lazy(() => import("./users/EditUser"));
import RequestPage from "./requests/RequestPage";
// const RequestPage = lazy(() => import("./requests/RequestPage"));
import RequestListPage from "./requests/RequestListPage";
// const RequestListPage = lazy(() => import("./requests/RequestListPage"));
import ConversationListPage from "./conversations/ConversationListPage";
// const ConversationListPage = lazy(
//   () => import("./conversations/ConversationListPage"),
// );
import GroupList from "./groups/GroupList";
// const GroupList = lazy(() => import("./groups/GroupList"));
import CreateGroupForm from "./groups/CreateGroupForm";
// const CreateGroupForm = lazy(() => import("./groups/CreateGroupForm"));
import GroupPage from "./groups/GroupPage";
// const GroupPage = lazy(() => import("./groups/GroupPage"));
import GroupInvite from "./groups/GroupInvite";
// const GroupInvite = lazy(() => import("./groups/GroupInvite"));
import GroupSearchPage from "./groups/GroupSearchPage";
// const GroupSearchPage = lazy(() => import("./groups/GroupSearchPage"));
import GroupRequest from "./groups/GroupRequest";
// const GroupRequest = lazy(() => import("./groups/GroupRequest"));
import GroupConversationPage from "./groupConversations/GroupConversationPage";
// const GroupConversationPage = lazy(
//   () => import("./groupConversations/GroupConversationPage"),
// );
import DeleteGroupMembers from "./groups/DeleteGroupMembers";
// const DeleteGroupMembers = lazy(() => import("./groups/DeleteGroupMembers"));
import BlockedUserPage from "./blockUser/BlockedUserPage";
// const BlockedUserPage = lazy(() => import("./blockUser/BlockedUserPage"));
import UserRoutes from "./routes/UserRoutes";
import LoggedOutRoutes from "./routes/LoggedOutRoutes";
import { useAppSelector } from "./features/hooks";
import ErrorRoutes from "./routes/ErrorRoutes";
import { shallowEqual } from "react-redux";

const RouteList = (): JSX.Element | null => {
  const location = useLocation();
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading,
    shallowEqual,
  );

  return !loading ? (
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : null;
};

export default RouteList;
