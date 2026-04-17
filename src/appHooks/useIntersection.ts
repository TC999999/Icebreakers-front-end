import { useState, useRef, useEffect } from "react";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";
import type { RequestInfiniteQueryRes } from "../types/requestTypes";

type options = {
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<RequestInfiniteQueryRes, unknown>,
      Error
    >
  >;
};

// custom hook for intersection wrapper for infinite scroll bottom component; when child component
// is 20% in view port, fetches new data for infinte scroll
const useIntersection = ({ fetchNextPage }: options) => {
  const targetRef = useRef(null);
  const parentRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsIntersecting(true);
        else setIsIntersecting(false);
      },
      { threshold: 0.2 },
    );

    if (targetRef.current) observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [isIntersecting]);

  useEffect(() => {
    if (isIntersecting) fetchNextPage();
  }, [isIntersecting]);

  return { targetRef, parentRef };
};

export default useIntersection;
