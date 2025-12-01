export type conversation = {
  id: string;
  title: string;
  otherUser: string;
  lastUpdatedAt: string;
  unreadMessages: number;
  latestMessage?: string;
  isTyping?: boolean;
};

export type conversationMessage = {
  id: string;
  content: string;
  username: string;
  createdAt: string;
};

export type savedMessage = {
  content: string;
};

export type currentConversation = {
  id: string;
  title: string;
  recipient: string;
  isOnline: boolean;
};

export type updateConversation = { title: string };

export type returnUpdateConversation = {
  id: string;
  title: string;
  lastUpdatedAt: string;
};
