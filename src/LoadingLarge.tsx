import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import "./styles/LoadingLarge.scss";

type Props = {
  lazy?: boolean;
};

// loading screen for getting user info (upon refresh)
const LoadingLarge: React.FC<Props> = ({ lazy }): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.user.loading.loadingInfo.pageLoading,
    shallowEqual,
  );

  return loading || lazy ? (
    <div id="large-loading-message-background">
      <div id="large-loading-message-content">
        <h2>Loading...</h2>
      </div>
    </div>
  ) : null;
};

export default LoadingLarge;
