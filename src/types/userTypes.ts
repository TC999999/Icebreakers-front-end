export type UserProfile = {
  username: string;
  biography: string;
  interests: string[];
  favoriteColor: string;
  createdAt: string;
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
