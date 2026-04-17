export type UserProfile = {
  username: string;
  biography: string;
  interests: string[];
  favoriteColor: string;
  createdAt: string;
  requestSent?: boolean;
  conversationExists?: boolean;
  blockedOtherUser?: boolean;
  blockedByOtherUser?: boolean;
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

export type UserSearchParams = {
  username: string | null;
  findSimilarInterests: boolean | null;
};

export type GroupUser = { favoriteColor: string; username: string };

export type UserEdit = {
  emailAddress: string;
  favoriteColor: string;
  biography: string;
  interests: number[];
};

export type GroupUserTab = {
  username: string;
  favoriteColor: string;
  isOnline: boolean;
};

export type GroupMessageUserUpdate = {
  id: string;
  username: string;
  unreadGroupMessages: number;
};

export type UserTyping = {
  [key: string]: number;
};

export type BlockedUser = {
  username: string;
  favoriteColor: string;
  blockedAt: string;
};
