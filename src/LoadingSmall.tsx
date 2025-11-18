import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import "./styles/LoadingSmall.scss";

// loading screen for submitting forms or getting data on pathname change
const LoadingSmall = (): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.formLoading,
    shallowEqual
  );
  return loading ? (
    <div id="small-loading-message-background">
      <div id="small-loading-message-content">
        <h2>Loading...</h2>
      </div>
    </div>
  ) : null;
};

export default LoadingSmall;
