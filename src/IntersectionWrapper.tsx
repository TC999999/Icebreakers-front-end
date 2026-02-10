import React, { type ReactNode } from "react";
import useIntersection from "./appHooks/useIntersection";
import "./styles/IntersectionWrapper.scss";

type Props = {
  threshold?: number;
  scrollMargin?: string;
  rootMargin?: string;
  children: ReactNode;
  fallback: ReactNode;
};

const IntersectionWrapper: React.FC<Props> = ({
  threshold,
  scrollMargin,
  rootMargin,
  children,
  fallback,
}) => {
  const { targetRef, isIntersecting } = useIntersection({
    threshold,
    scrollMargin,
    rootMargin,
  });
  return (
    <div className="intersection-wrapper" ref={targetRef}>
      {isIntersecting ? children : fallback}
    </div>
  );
};

export default IntersectionWrapper;
