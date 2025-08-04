import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import "./styles/LoadingLarge.scss";

// loading screen for getting user info (upon refresh)
const LoadingLarge = (): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading,
    shallowEqual
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
