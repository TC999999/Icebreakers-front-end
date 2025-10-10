import { useAppSelector } from "../features/hooks";
import type { conversationMessage } from "../types/conversationTypes";
import { DateTime } from "luxon";
import "../styles/ConversationMessageBubble.scss";

type Props = { conversationMessage: conversationMessage };

const ConversationMessageBubble: React.FC<Props> = ({
  conversationMessage,
}) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  });
  let newDate = DateTime.fromISO(conversationMessage.createdAt).toFormat(
    "MM/dd/yy, h:mm a"
  );
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
        <small>{newDate}</small>
        <br />
        <small>From: {conversationMessage.username}</small>
      </div>
    </div>
  );
};

export default ConversationMessageBubble;
