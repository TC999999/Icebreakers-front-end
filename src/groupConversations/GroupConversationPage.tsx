import GroupTabList from "./GroupTabList";
import GroupUserTabList from "./GroupUserTabList";
import GroupConversationMessages from "./GroupConversationMessages";
import "../styles/groupConversations/GroupConversationPage.scss";

import useGroupConversationPage from "./hooks/useGroupConversationPage";

const GroupConversationPage = () => {
  const {
    groupTabs,
    currentUsers,
    currentMessages,
    selectedGroup,
    messageInput,
    changeSelectedTab,
    handleMessage,
    handleSend,
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
            selctedGroup={selectedGroup}
            messages={currentMessages}
            messageInput={messageInput}
            handleMessage={handleMessage}
            handleSend={handleSend}
          />
        </div>
      </div>
    </main>
  );
};

export default GroupConversationPage;
