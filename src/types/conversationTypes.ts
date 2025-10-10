export type conversation = {
  id: number;
  title: string;
  lastUpdatedAt: string;
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
  recipient: string;
};
