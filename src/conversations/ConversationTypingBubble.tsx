import "../styles/conversations/ConversationTypingBubble.scss";

const ConversationTypingBubble = () => {
  return (
    <div className="conversation-typing-bubble">
      <div id="ellipses">
        <span className="ellipsis" id="ellipsis-1">
          .
        </span>
        <span className="ellipsis" id="ellipsis-2">
          .
        </span>
        <span className="ellipsis" id="ellipsis-3">
          .
        </span>
      </div>
    </div>
  );
};

export default ConversationTypingBubble;
