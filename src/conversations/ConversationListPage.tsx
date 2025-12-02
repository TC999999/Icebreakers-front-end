import "../styles/conversations/ConversationListPage.scss";
import useConversationListPage from "./hooks/useConversationListPage";
import ConversationMessageBubble from "./ConversationMessageBubble";
import ConversationLoading from "./ConversationLoading";
import EditConversation from "./EditConversation";
import ConversationTabList from "./ConversationTabList";
import ConversationTabListTablet from "./ConversationTabListTablet";
import { FaArrowUp } from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5";

const ConversationListPage = () => {
  const {
    loadingMessages,
    messageInput,
    currentConversation,
    conversations,
    currentMessages,
    typingMessage,
    showEditForm,
    showTabletConversationTabs,
    scrollRef,
    handleChangeInput,
    handleCurrentConversation,
    toggleEditForm,
    toggleTabletConversationTabs,
    handleSend,
    handleBlur,
    handleFocus,
    updateConversations,
  } = useConversationListPage();

  // component for conversation page: including tab list, message window, and message input
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

      <ConversationTabListTablet
        conversations={conversations}
        currentConversation={currentConversation}
        handleCurrentConversation={handleCurrentConversation}
        show={showTabletConversationTabs}
        toggleTabletConversationTabs={toggleTabletConversationTabs}
      />

      <div id="conversation-list">
        <div id="conversation-list-window">
          <ConversationTabList
            conversations={conversations}
            currentConversation={currentConversation}
            handleCurrentConversation={handleCurrentConversation}
          />
          <div id="conversation-messages-window">
            {loadingMessages ? (
              <ConversationLoading />
            ) : (
              <div ref={scrollRef} id="conversation-messages">
                <header id="messages-header">
                  <div id="conversation-tab-button">
                    <button
                      type="button"
                      className="tab-button"
                      title="Show Conversations"
                      onClick={(e) => toggleTabletConversationTabs(e)}
                    >
                      <IoReorderThree />
                    </button>
                  </div>
                  {currentMessages.length > 0 && (
                    <h3>
                      {currentConversation.title.length > 0
                        ? currentConversation.title
                        : currentConversation.recipient}
                    </h3>
                  )}
                  {currentConversation.recipient.length > 0 && (
                    <div>
                      <span>
                        <b>With:</b> {currentConversation.recipient}{" "}
                        <div
                          id="online-status"
                          title={`${currentConversation.recipient} is ${
                            currentConversation.isOnline ? `online` : `offline`
                          }`}
                          className={
                            currentConversation.isOnline ? "online" : "offline"
                          }
                        ></div>
                      </span>
                    </div>
                  )}
                  {currentConversation.id.length > 0 && (
                    <div id="edit-conversation-button">
                      <button
                        className="edit-button"
                        type="button"
                        onClick={(e) => toggleEditForm(e)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </header>

                {currentMessages.length === 0 && !loadingMessages && (
                  <div id="no-conversation-selected-message">
                    <h5>
                      Please select one of the conversations on the left. If
                      viewing on a smaller screen, click the top left button and
                      select a conversation.
                    </h5>
                  </div>
                )}

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
              <form id="send-message-form" onSubmit={handleSend}>
                <div id="message-div" className="form-div">
                  <textarea
                    id="content"
                    name="content"
                    className="form-input"
                    value={messageInput.content}
                    onChange={handleChangeInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rows={5}
                    cols={40}
                    placeholder="Type a message here"
                    disabled={currentConversation.id.length === 0}
                    autoComplete="off"
                  ></textarea>
                </div>
                <div>
                  <button
                    title="Send Message"
                    className="send-button"
                    disabled={currentConversation.id.length === 0}
                  >
                    <FaArrowUp />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConversationListPage;
