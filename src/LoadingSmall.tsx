import { type JSX } from "react";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import "./styles/LoadingSmall.scss";

type Props = {
  lazy?: boolean;
};

// loading screen for submitting forms or getting data on pathname change
const LoadingSmall: React.FC<Props> = ({
  lazy = false,
}): JSX.Element | null => {
  const loading: boolean = useAppSelector(
    (store) => store.loading.loadingInfo.formLoading,
    shallowEqual,
  );
  return loading || lazy ? (
    <div className="modal-transparent modal-background">
      <div className="modal-content" id="small-loading-message-content">
        <h2>Loading...</h2>
      </div>
    </div>
  ) : null;
};

export default LoadingSmall;
