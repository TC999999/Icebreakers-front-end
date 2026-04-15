import { lazy, Suspense } from "react";
import useConversationListPage from "./hooks/useConversationListPage";
import ConversationMessageBubble from "./ConversationMessageBubble";
import ConversationLoading from "./ConversationLoading";
const EditConversation = lazy(() => import("./EditConversation"));
import ConversationTabList from "./ConversationTabList";
import LoadingSmall from "../LoadingSmall";
const ConversationTabListTablet = lazy(
  () => import("./ConversationTabListTablet"),
);
import { FaArrowUp } from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5";
import "../styles/conversations/ConversationListPage.scss";

const ConversationListPage = () => {
  const {
    loadingMessages,
    loadingConversations,
    messageInput,
    conversationID,
    title,
    recipient,
    isOnline,
    conversations,
    messages: currentMessages,
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
      {showEditForm && (
        <Suspense fallback={<LoadingSmall lazy={true} />}>
          <EditConversation
            currentConversation={{
              id: conversationID,
              title,
              recipient,
              isOnline,
            }}
            hideForm={toggleEditForm}
            updateConversations={updateConversations}
          />
        </Suspense>
      )}

      <header>
        <h1>Your Conversations</h1>
        <h3>All of your direct messages with other users.</h3>
      </header>

      {showTabletConversationTabs && (
        <Suspense fallback={<LoadingSmall lazy={true} />}>
          <ConversationTabListTablet
            conversations={conversations}
            currentConversationID={conversationID}
            loadingConversations={loadingConversations}
            handleCurrentConversation={handleCurrentConversation}
            toggleTabletConversationTabs={toggleTabletConversationTabs}
          />
        </Suspense>
      )}

      <div id="conversation-list">
        <div id="conversation-list-window">
          <ConversationTabList
            conversations={conversations}
            currentConversationID={conversationID}
            loadingConversations={loadingConversations}
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
                      aria-label="Show Conversations"
                      onClick={(e) => toggleTabletConversationTabs(e)}
                    >
                      <IoReorderThree />
                    </button>
                  </div>

                  {conversationID && <h3>{title ? title : recipient}</h3>}
                  {recipient.length > 0 && (
                    <div>
                      <span>
                        <b>With:</b> {recipient}{" "}
                        <div
                          id="online-status"
                          title={`${recipient} is ${
                            isOnline ? `online` : `offline`
                          }`}
                          className={isOnline ? "online" : "offline"}
                        ></div>
                      </span>
                    </div>
                  )}

                  {conversationID.length > 0 && (
                    <>
                      <div id="edit-conversation-button">
                        <button
                          className="edit-button"
                          type="button"
                          onClick={(e) => toggleEditForm(e)}
                        >
                          Change Title
                        </button>
                      </div>
                    </>
                  )}
                </header>

                {conversationID.length === 0 && !loadingMessages && (
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
                      isGroup={false}
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
                    value={messageInput}
                    onChange={handleChangeInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rows={5}
                    cols={40}
                    placeholder="Type a message here"
                    disabled={conversationID.length === 0}
                    autoComplete="off"
                  ></textarea>
                </div>
                <div>
                  <button
                    title="Send Message"
                    className="send-button"
                    aria-label="Send Message"
                    disabled={conversationID.length === 0}
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
