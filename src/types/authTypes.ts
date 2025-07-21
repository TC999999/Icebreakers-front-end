export type Register = {
  username: string;
  password: string;
  favoriteColor: string;
  emailAddress: string;
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
};

type loadingInfo = {
  pageLoading: boolean;
  formLoading: boolean;
};

type loadingError = {
  message: string;
  status: string | null;
};

export type LoadingContext = {
  loadingInfo: loadingInfo;
  loadingError: loadingError;
};

export type ReduxAuthState = {
  user: UserState | null;
  loading: LoadingContext;
};
