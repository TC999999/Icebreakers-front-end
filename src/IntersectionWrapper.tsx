import React, { type ReactNode } from "react";
import useIntersection from "./appHooks/useIntersection";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";
import type { requestInfiniteQueryRes } from "./types/requestTypes";

import "./styles/IntersectionWrapper.scss";

type Props = {
  fallback?: ReactNode;
  hasNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<requestInfiniteQueryRes, unknown>,
      Error
    >
  >;
};

// intersection wrapper component; used for infinite scroll lists; when no new data can be fetched,
// returns null
const IntersectionWrapper: React.FC<Props> = ({
  fallback,
  hasNextPage,
  fetchNextPage,
}) => {
  const { targetRef } = useIntersection({
    fetchNextPage,
  });
  return hasNextPage ? (
    <div id="intersection-wrapper" ref={targetRef}>
      {fallback}
    </div>
  ) : null;
};

export default IntersectionWrapper;
