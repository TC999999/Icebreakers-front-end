import { type JSX, useEffect } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";

// error page for server side errors
const Error = (): JSX.Element => {
  const loadingError = useAppSelector((store) => {
    return store.user.loading.loadingError;
  }, shallowEqual);

  useEffect(() => {
    console.log(loadingError);
  }, []);
  return (
    <div>
      <h1>{loadingError.status} Error</h1>
      <h2>{loadingError.message}</h2>
    </div>
  );
};

export default Error;
