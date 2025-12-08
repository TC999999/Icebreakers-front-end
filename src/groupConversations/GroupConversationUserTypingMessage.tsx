import React from "react";
import "../styles/groupConversations/GroupConversationUserTypingMessage.scss";

type Props = { username: string };

const GroupConversationUserTypingMessage: React.FC<Props> = ({ username }) => {
  return (
    <div className="group-conversation-user-typing">
      {username} is typing
      <span id="ellipses">
        <span className="ellipsis" id="ellipsis-1">
          .
        </span>
        <span className="ellipsis" id="ellipsis-2">
          .
        </span>
        <span className="ellipsis" id="ellipsis-3">
          .
        </span>
      </span>
    </div>
  );
};

export default GroupConversationUserTypingMessage;
