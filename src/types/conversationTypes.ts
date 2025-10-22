export type conversation = {
  id: number;
  title: string;
  otherUser: string;
  lastUpdatedAt: string;
  unreadMessages: number;
};

export type conversationMessage = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
};

export type savedMessage = {
  content: string;
};

export type currentConversation = {
  id: number;
  title: string;
  recipient: string;
};

export type updateConversation = { title: string };

export type returnUpdateConversation = {
  id: number;
  title: string;
  lastUpdatedAt: string;
};
