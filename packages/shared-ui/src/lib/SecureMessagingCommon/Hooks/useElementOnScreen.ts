import React from "react";

export const useElementOnScreen = (options: IntersectionObserverInit) => {
  const containerRef = React.useRef<HTMLDivElement>();
  const [isVisible, setVisible] = React.useState(false);

  const callBack = (entries: any) => {
    const { isIntersecting } = entries[0];
    setVisible(isIntersecting);
  };
  React.useEffect(() => {
    const observer = new IntersectionObserver(callBack, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, isVisible]);

  return [containerRef, isVisible];
};
