import { useLayoutEffect } from "react";

export const useAutoScroll = () => {
  const scrollTarget = "Past-0";
  useLayoutEffect(() => {
    setTimeout(() => {
      handleScroll(scrollTarget);
    }, 500);
    setTimeout(() => {
      handleScroll(scrollTarget);
    }, 1000);
  }, []);

  return scrollTarget;
};

const handleScroll = (target: string) => {
  const top = document.getElementById(target);
  top &&
    top.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
};
