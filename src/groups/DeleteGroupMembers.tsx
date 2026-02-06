import { lazy, Suspense } from "react";

import useDeleteGroupMembers from "./hooks/useDeleteGroupMembers";
import DeleteGroupMembersList from "./DeleteGroupMembersList";
import LoadingSmall from "../LoadingSmall";
const DeleteGroupMemberWarning = lazy(
  () => import("./DeleteGroupMemberWarning"),
);
// import DeleteGroupMemberWarning from "./DeleteGroupMemberWarning";

import "../styles/groups/DeleteGroupMembers.scss";

const DeleteGroupMembers = () => {
  const {
    users,
    groupTitle,
    showRemoveWindow,
    currentRemovedUser,
    handleRemoveButton,
    handleRemoveUser,
  } = useDeleteGroupMembers();
  return (
    <>
      {showRemoveWindow && (
        <Suspense fallback={<LoadingSmall lazy={true} />}>
          <DeleteGroupMemberWarning
            title={groupTitle}
            username={currentRemovedUser}
            cancel={handleRemoveButton}
            remove={handleRemoveUser}
          />
        </Suspense>
      )}
      <main id="delete-group-member-page">
        <header>
          <h1>Remove Members from {groupTitle}</h1>
          <h3>Click one of the users below to remove them from this group</h3>
        </header>

        <DeleteGroupMembersList
          groupUsers={users}
          handleRemoveButton={handleRemoveButton}
        />
      </main>
    </>
  );
};

export default DeleteGroupMembers;
