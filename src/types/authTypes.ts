export type Register = {
  username: string;
  password: string;
  favoriteColor: string;
  emailAddress: string;
  biography: string;
  interests: number[];
};

export type LogIn = {
  username: string;
  password: string;
};

export type UserState = {
  username: string;
  favoriteColor: string;
  isAdmin: boolean;
  isFlagged: boolean;
  unansweredRequests: number;
  unreadDirectMessages: number;
  unreadGroupMessages: number;
};

type LoadingInfo = {
  pageLoading: boolean;
  formLoading: boolean;
};

export type LoadingError = {
  message: string;
  status: number | null;
};

export type LoadingContext = {
  loadingInfo: LoadingInfo;
  loadingError: LoadingError;
};

export type ReduxAuthState = {
  user: UserState | null;
};
