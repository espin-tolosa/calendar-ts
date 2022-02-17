import { useLayoutEffect } from "react";

/* usage: take the returned value of the hook and pass it as an id to the component you want to auto scroll

const targetToScroll = useAutoScroll( )

...
return (
	<div>
		<div>
			<div id={targetToScroll} />
		</div>
	</div>

)

*/
export const useAutoScroll = (delay_ms = 500) => {
  const scrollTarget = "AutoScrollTarget_OnlyOneUniqueId";
  useLayoutEffect(() => {
    setTimeout(() => {
      handleScroll(scrollTarget);
    }, delay_ms);
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
