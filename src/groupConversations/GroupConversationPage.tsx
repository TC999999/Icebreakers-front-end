import GroupTabList from "./GroupTabList";
import GroupUserTabList from "./GroupUserTabList";
import GroupConversationMessages from "./GroupConversationMessages";
import "../styles/groupConversations/GroupConversationPage.scss";

import useGroupConversationPage from "./hooks/useGroupConversationPage";

const GroupConversationPage = () => {
  const {
    groupTabs,
    scrollRef,
    currentUsers,
    currentMessages,
    selectedGroup,
    messageInput,
    usersTyping,
    changeSelectedTab,
    handleMessage,
    handleSend,
    handleFocus,
    handleBlur,
  } = useGroupConversationPage();
  return (
    <main id="group-conversation-page">
      <h1>Group Conversations</h1>
      <h3>Chat with all of your groups here!</h3>
      <div id="group-conversation-messaging">
        <GroupTabList
          selectedGroup={selectedGroup}
          groupTabList={groupTabs}
          changeSelectedTab={changeSelectedTab}
        />
        <div id="group-convertation-message-window">
          <GroupUserTabList currentUsers={currentUsers} />
          <GroupConversationMessages
            scrollReference={scrollRef}
            selctedGroup={selectedGroup}
            messages={currentMessages}
            messageInput={messageInput}
            usersTyping={usersTyping}
            handleMessage={handleMessage}
            handleSend={handleSend}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
          />
        </div>
      </div>
    </main>
  );
};

export default GroupConversationPage;
