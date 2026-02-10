import { useRef, useState, useEffect } from "react";

type options = {
  threshold?: number;
  scrollMargin?: string;
  rootMargin?: string;
};

const useIntersection = (options: options) => {
  const targetRef = useRef(null);
  const parentRef = useRef(null);
  const [isIntersecting, setIsInterecting] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInterecting(entry.isIntersecting);
    }, options);

    if (targetRef.current) observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [options]);

  return { targetRef, parentRef, isIntersecting };
};

export default useIntersection;
