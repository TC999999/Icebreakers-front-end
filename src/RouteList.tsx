import { type JSX } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LogIn from "./auth/LogIn";
import SignUp from "./auth/SignUp";
import HomePage from "./home/HomePage";
import NotFound from "./NotFound";
import Error from "./Error";
import UserProfile from "./users/UserProfile";
import UserSearch from "./users/UserSearch";
import EditUser from "./users/EditUser";
import RequestPage from "./requests/RequestPage";
import RequestListPage from "./requests/RequestListPage";
import ConversationListPage from "./conversations/ConversationListPage";
import GroupList from "./groups/GroupList";
import CreateGroupForm from "./groups/CreateGroupForm";
import GroupPage from "./groups/GroupPage";
import GroupInvite from "./groups/GroupInvite";
import GroupSearchPage from "./groups/GroupSearchPage";
import GroupRequest from "./groups/GroupRequest";
import GroupConversationPage from "./groupConversations/GroupConversationPage";
import UserRoutes from "./routes/UserRoutes";
import LoggedOutRoutes from "./routes/LoggedOutRoutes";
import { useAppSelector } from "./features/hooks";
import ErrorRoutes from "./routes/ErrorRoutes";
import { shallowEqual } from "react-redux";

const RouteList = (): JSX.Element | null => {
  const location = useLocation();
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading,
    shallowEqual
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
