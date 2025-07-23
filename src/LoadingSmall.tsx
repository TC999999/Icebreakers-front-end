import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";

const LoadingSmall = (): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.formLoading
  );
  return loading ? <div>Loading...</div> : null;
};

export default LoadingSmall;
