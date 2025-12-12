import BlockedUserList from "./BlockedUserList";
import useBlockedUserPage from "./hooks/useBlockedUserPage";
import "../styles/blockUser/BlockedUserPage.scss";

// React Component that contains main page of a single user's blocked list, including header
// and list
const BlockedUserPage = () => {
  const { blockedUsers, unblockUser } = useBlockedUserPage();
  return (
    <main id="blocked-users-list-page">
      <header>
        <h1>Blocked List</h1>
        <h3>
          Here is a list of users you have blocked. You will be able to unblock
          them as well.
        </h3>
      </header>

      <BlockedUserList blockedUsers={blockedUsers} unblockUser={unblockUser} />
    </main>
  );
};

export default BlockedUserPage;
