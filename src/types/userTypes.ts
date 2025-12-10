export type UserProfile = {
  username: string;
  biography: string;
  interests: string[];
  favoriteColor: string;
  createdAt: string;
  requestSent?: boolean;
  conversationExists?: boolean;
  blockedByYou?: boolean;
  blockedByThem?: boolean;
};

export type UserCard = {
  username: string;
  favoritecolor: string;
  interests: string[];
};

export type UserSearch = {
  username: string;
  findSimilarInterests: boolean;
};

export type groupUser = { favoriteColor: string; username: string };

export type UserEdit = {
  emailAddress: string;
  favoriteColor: string;
  biography: string;
  interests: number[];
};

export type groupUserTab = {
  username: string;
  favoriteColor: string;
  isOnline: boolean;
};

export type groupMessageUserUpdate = {
  id: string;
  username: string;
  unreadGroupMessages: number;
};

export type userTyping = {
  [key: string]: number;
};
