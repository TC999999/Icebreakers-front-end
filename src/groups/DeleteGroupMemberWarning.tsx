import React from "react";
import "../styles/groups/DeleteGroupMemberWarning.scss";

type Props = {
  show: boolean;
  username: string;
  title: string;
  cancel: (e: React.MouseEvent<HTMLButtonElement>, username: string) => void;
  remove: (
    e: React.MouseEvent<HTMLButtonElement>,
    removedUser: string
  ) => Promise<void>;
};

const DeleteGroupMemberWarning: React.FC<Props> = ({
  show,
  username,
  title,
  cancel,
  remove,
}) => {
  return show ? (
    <div className="modal-transparent modal-background">
      <div className="modal-content" id="delete-group-member-warning">
        <header>
          <h3>
            Are you sure you want to remove {username} from {title}{" "}
          </h3>
        </header>
        <section id="delete-group-member-warning-info">
          <h4>Some things to consider:</h4>
          <ul>
            <li>
              If you remove a member from this group, they will no longer be
              able to send messages in the group conversation.
            </li>
            <li>
              If you change your mind after the fact, please send a new
              invitation to that user to join this group.
            </li>
            <li>
              If you wish to prevent this user from contacting you after the
              fact, please block this user by clicking the "Block User" button
              on their user profile page.
            </li>
          </ul>
        </section>
        <div id="button-row">
          <button
            className="cancel-button"
            onClick={(e) => cancel(e, username)}
          >
            Cancel
          </button>
          <button
            className="submit-button"
            onClick={(e) => remove(e, username)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default DeleteGroupMemberWarning;
