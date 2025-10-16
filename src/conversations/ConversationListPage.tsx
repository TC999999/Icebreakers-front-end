import "../styles/ConversationListPage.scss";
import useConversationListPage from "./hooks/useConversationListPage";
import ConversationTab from "./ConversationTab";
import ConversationMessageBubble from "./ConversationMessageBubble";
import ConversationLoading from "./ConversationLoading";

const ConversationListPage = () => {
  const {
    loadingMessages,
    messageInput,
    currentConversation,
    conversations,
    currentMessages,
    typingMessage,
    scrollRef,
    handleChangeInput,
    handleCurrentConversation,
    handleSend,
    handleBlur,
    handleFocus,
  } = useConversationListPage();

  return (
    <main id="conversations-list-page">
      <header>
        <h1>Your Conversations</h1>
        <h3>All of your direct messages with other users.</h3>
      </header>

      <div id="conversation-list">
        <div id="conversation-list-window">
          <div id="conversation-tabs">
            {conversations.map((c) => {
              return (
                <ConversationTab
                  key={`conversation-${c.id}`}
                  conversation={c}
                  selected={currentConversation.id === c.id}
                  handleCurrentConversation={handleCurrentConversation}
                />
              );
            })}
          </div>
          <div id="conversation-messages-window">
            {loadingMessages ? (
              <ConversationLoading />
            ) : (
              <div ref={scrollRef} id="conversation-messages">
                <header id="messages-header">
                  {currentConversation.recipient}
                  <div id="edit-conversation-button">
                    <button>Edit</button>
                  </div>
                </header>

                {currentMessages.map((m) => {
                  return (
                    <ConversationMessageBubble
                      key={`conversation-${m.id}`}
                      conversationMessage={m}
                    />
                  );
                })}
                {typingMessage.length > 0 && (
                  <div id="typing-message">
                    {typingMessage}
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
                )}
              </div>
            )}

            <div id="conversation-message-input">
              <form name="content" onSubmit={handleSend}>
                <input
                  type="text"
                  id="content"
                  name="content"
                  value={messageInput.content}
                  onChange={handleChangeInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Type a message here"
                  disabled={currentConversation.id === 0}
                />
                <button disabled={currentConversation.id === 0}>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConversationListPage;
