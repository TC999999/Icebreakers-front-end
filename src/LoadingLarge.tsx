import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";
import "./styles/LoadingLarge.scss";

const LoadingLarge = (): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading
  );

  return loading ? (
    <div id="large-loading-message-background">
      <div id="large-loading-message-content">
        <h2>Loading...</h2>
      </div>
    </div>
  ) : null;
};

export default LoadingLarge;
