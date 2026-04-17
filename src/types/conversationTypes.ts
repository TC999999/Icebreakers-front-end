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
  new?: boolean;
};

export interface currentConversation {
  id: string;
  title: string;
  recipient: string;
  isOnline: boolean;
}

export interface currentConversationMessages extends currentConversation {
  messages: conversationMessage[];
  unreadMessages: number;
}

export type updateConversation = { title: string };

export type returnUpdateConversation = {
  id: string;
  title: string;
  lastUpdatedAt: string;
};

export type newConversationMessage = { content: string };

export type newMessage = {
  id: string;
  username: string;
  content: string;
  otherUser: string;
};

export type createMessagesReturn = {
  message: conversationMessage;
};
