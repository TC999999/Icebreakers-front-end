export type Conversation = {
  id: string;
  title: string;
  otherUser: string;
  lastUpdatedAt: string;
  unreadMessages: number;
  latestMessage?: string;
  isTyping?: boolean;
};

export type ConversationMessage = {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  new?: boolean;
};

export interface CurrentConversation {
  id: string;
  title: string;
  recipient: string;
  isOnline: boolean;
}

export interface CurrentConversationMessages extends CurrentConversation {
  messages: ConversationMessage[];
  unreadMessages: number;
}

export type ReturnUpdateConversation = {
  id: string;
  title: string;
  lastUpdatedAt: string;
};

export type NewConversationMessage = { content: string };

export type NewMessage = {
  id: string;
  username: string;
  content: string;
  otherUser: string;
};

export type CreateMessagesReturn = {
  message: ConversationMessage;
};
