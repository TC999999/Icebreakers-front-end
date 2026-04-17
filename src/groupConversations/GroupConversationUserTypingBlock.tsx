import React from "react";
import type { UserTyping } from "../types/userTypes";
import GroupConversationUserTypingMessage from "./GroupConversationUserTypingMessage";
import "../styles/groupConversations/GroupConversationUserTypingBlock.scss";

type Props = { usersTyping: UserTyping };

const GroupConversationUserTypingBlock: React.FC<Props> = ({ usersTyping }) => {
  return (
    <div id="users-typing">
      {Object.keys(usersTyping).map(
        (u) =>
          usersTyping[u] > 0 && (
            <GroupConversationUserTypingMessage
              key={"user-" + u}
              username={u}
            />
          ),
      )}
    </div>
  );
};

export default GroupConversationUserTypingBlock;
