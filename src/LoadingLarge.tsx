import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";
import "./styles/LoadingLarge.scss";
import { shallowEqual } from "react-redux";

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
