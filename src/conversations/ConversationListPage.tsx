import "../styles/conversations/ConversationListPage.scss";
import useConversationListPage from "./hooks/useConversationListPage";
import ConversationTab from "./ConversationTab";
import ConversationMessageBubble from "./ConversationMessageBubble";
import ConversationLoading from "./ConversationLoading";
import EditConversation from "./EditConversation";

const ConversationListPage = () => {
  const {
    loadingMessages,
    messageInput,
    currentConversation,
    conversations,
    currentMessages,
    typingMessage,
    showEditForm,
    scrollRef,
    handleChangeInput,
    handleCurrentConversation,
    toggleEditForm,
    handleSend,
    handleBlur,
    handleFocus,
    updateConversations,
  } = useConversationListPage();

  return (
    <main id="conversations-list-page">
      <EditConversation
        show={showEditForm}
        currentConversation={currentConversation}
        hideForm={toggleEditForm}
        updateConversations={updateConversations}
      />

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
                  <h3>
                    {currentConversation.title.length > 0
                      ? currentConversation.title
                      : currentConversation.recipient}
                  </h3>
                  <div>
                    {currentConversation.recipient.length > 0 && (
                      <span>
                        <b>With:</b> {currentConversation.recipient}
                      </span>
                    )}
                  </div>
                  {currentConversation.id.length > 0 && (
                    <div id="edit-conversation-button">
                      <button type="button" onClick={(e) => toggleEditForm(e)}>
                        Edit
                      </button>
                    </div>
                  )}
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
              <form onSubmit={handleSend}>
                <input
                  type="text"
                  id="content"
                  name="content"
                  value={messageInput.content}
                  onChange={handleChangeInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Type a message here"
                  disabled={currentConversation.id.length === 0}
                />
                <button disabled={currentConversation.id.length === 0}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConversationListPage;
