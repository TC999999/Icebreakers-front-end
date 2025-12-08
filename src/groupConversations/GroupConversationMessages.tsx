import "../styles/groupConversations/GroupConversationMessages.scss";
import type {
  newConversationMessage,
  conversationMessage,
} from "../types/conversationTypes";
import type { userTyping } from "../types/userTypes";
import ConversationMessageBubble from "../conversations/ConversationMessageBubble";
import GroupConversationUserTypingBlock from "./GroupConversationUserTypingBlock";

type Props = {
  scrollReference: React.RefObject<HTMLDivElement | null>;
  selctedGroup: string;
  messageInput: newConversationMessage;
  messages: conversationMessage[];
  usersTyping: userTyping;
  handleMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: (e: React.FormEvent) => void;
  handleFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
};

// react component showing all messages in a single group conversation
const GroupConversationMessages: React.FC<Props> = ({
  scrollReference,
  selctedGroup,
  messageInput,
  messages,
  usersTyping,
  handleMessage,
  handleSend,
  handleFocus,
  handleBlur,
}) => {
  return (
    <div id="group-conversation-messages">
      <div ref={scrollReference} id="message-window">
        {messages.map((message) => (
          <ConversationMessageBubble
            key={message.id}
            conversationMessage={message}
            isGroup={true}
          />
        ))}
        <GroupConversationUserTypingBlock usersTyping={usersTyping} />
      </div>
      <div id="message-input">
        <form className="form-div" onSubmit={handleSend}>
          <textarea
            name="content"
            id="content"
            className="form-input"
            placeholder="Type Your Message Here"
            value={messageInput.content}
            onChange={handleMessage}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={selctedGroup.length === 0}
          ></textarea>

          <div id="send">
            <button
              className="submit-button"
              disabled={selctedGroup.length === 0}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupConversationMessages;
