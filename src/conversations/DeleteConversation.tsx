import React from "react";
import type { currentConversation } from "../types/conversationTypes";
import "../styles/conversations/DeleteConversation.scss";

type Props = {
  show: boolean;
  cancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  currentConversation: currentConversation;
};

const DeleteConversation: React.FC<Props> = ({
  show,
  cancel,
  currentConversation,
}) => {
  return show ? (
    <div className="modal-transparent modal-background">
      <div className="modal-content" id="delete-conversation-content">
        <h2>
          Do you want to delete this conversation with{" "}
          {currentConversation.recipient}
        </h2>
        <div id="delete-conversation-info-list">
          <h4>When you delete a direct conversation:</h4>
          <ul>
            <li>
              You will delete all messages you have exchanged with the other
              user
            </li>
            <li>
              Neither you nor the other user will not be able to send each other
              any new messages
            </li>
            <li>
              If either of you change your mind later on, you will need to send
              the other user a request to start a new conversation
            </li>
          </ul>
        </div>

        <div id="button-row">
          <button
            type="button"
            className="cancel-button"
            onClick={(e) => cancel(e)}
          >
            Cancel
          </button>
          <button className="delete-button">Delete</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default DeleteConversation;
