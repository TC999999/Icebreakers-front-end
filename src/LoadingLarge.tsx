import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";

const LoadingLarge = (): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading
  );

  return loading ? <div>Loading...</div> : null;
};

export default LoadingLarge;
