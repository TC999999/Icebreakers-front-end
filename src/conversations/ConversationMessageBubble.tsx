import { memo } from "react";
import { useAppSelector } from "../features/hooks";
import type { conversationMessage } from "../types/conversationTypes";
import "../styles/conversations/ConversationMessageBubble.scss";
import createDate from "../helpers/createDate";
import { shallowEqual } from "react-redux";

type Props = { conversationMessage: conversationMessage; isGroup: boolean };

// component for conversation message bubbles, both for current and other user
const ConversationMessageBubble: React.FC<Props> = ({
  conversationMessage,
  isGroup,
}) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  }, shallowEqual);

  return (
    <div
      className={`direct-message-bubble ${
        conversationMessage.username === username
          ? "self-bubble"
          : "other-bubble"
      }`}
    >
      <div>
        <p>{conversationMessage.content}</p>
        {isGroup && conversationMessage.username !== username && (
          <>
            <small>From: {conversationMessage.username}</small>
            <br />
          </>
        )}
        <small>{createDate(conversationMessage.createdAt, "short")}</small>
      </div>
    </div>
  );
};

export default memo(ConversationMessageBubble);
