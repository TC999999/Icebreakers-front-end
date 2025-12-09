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

type loadingInfo = {
  pageLoading: boolean;
  formLoading: boolean;
};

export type loadingError = {
  message: string;
  status: number | null;
};

export type LoadingContext = {
  loadingInfo: loadingInfo;
  loadingError: loadingError;
};

export type ReduxAuthState = {
  user: UserState | null;
  loading: LoadingContext;
};
