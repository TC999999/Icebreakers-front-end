import type { JSX } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import type { LoadingError } from "./types/authTypes";

type Props = {
  error?: LoadingError;
};

// error page for server side errors
const Error = ({ error }: Props): JSX.Element => {
  const loadingError = useAppSelector((store) => {
    return store.loading.loadingError;
  }, shallowEqual);

  if (error) {
    <div>
      <h1>{error.status} Error</h1>
      <h2>{error.message}</h2>
    </div>;
  }

  return (
    <div>
      <h1>{loadingError.status} Error</h1>
      <h2>{loadingError.message}</h2>
    </div>
  );
};

export default Error;
