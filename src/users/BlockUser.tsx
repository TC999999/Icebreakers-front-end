import React from "react";
import "../styles/users/BlockUser.scss";

type Props = {
  username: string;
  show: boolean;
  cancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleBlockUser: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
};

// React component that shows user a list of details of what happens when they block another
// user and list of other actions they may want to take; also has buttons that either cancels
// blocking or proceeds with it
const BlockUser: React.FC<Props> = ({
  username,
  show,
  cancel,
  handleBlockUser,
}) => {
  return show ? (
    <div className="modal-transparent modal-background">
      <div className="modal-content" id="block-user-form-content">
        <h2>Do You Wish to Block {username}</h2>
        <div id="block-info-list">
          <h4>When you block another user:</h4>
          <ul>
            <li>
              Neither of you can send the other a direct message (if a
              conversation between you two still exist, it will not be deleted)
            </li>
            <li>
              Neither of you can send a request to the other to have a direct
              conversation
            </li>
            <li>
              Neither of you can send a request to join a group that the other
              hosts
            </li>
            <li>
              Neither of you can invite the other to join a group that you are a
              part of
            </li>
          </ul>

          <h4>
            If you have any pending requests (direct messaging, join a group
            they host, invite them to a group you are a member of) regarding
            this user:
          </h4>
          <ul>
            <li>
              If you have sent any requests to this user, they will not be able
              to respond to these requests. Please manually and remove these
              requests yourself. You will be unable to resend these requests.
            </li>
            <li>
              If they have sent you any requests, they will be able to remove
              these requests themselves, but not resend them. You will only be
              allowed to decline these requests.
            </li>
          </ul>

          <h4>
            If you share group with this user, you will not be able to remove or
            block them on that channel. However, if you have concerns about this
            user here are some things you can do:
          </h4>
          <ul>
            <li>
              If you host this group, please remove them manually from the group
            </li>
            <li>
              If they host the group, please remove yourself manually from the
              group
            </li>
            <li>
              If neither of you host the group, please either remove yourself
              from the group or contact the host with your concerns
            </li>
          </ul>
        </div>

        <div className="button-row">
          <button className="submit-button" onClick={(e) => cancel(e)}>
            Cancel
          </button>
          <button className="submit-button" onClick={(e) => handleBlockUser(e)}>
            Block
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default BlockUser;
