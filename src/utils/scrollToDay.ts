import { DateService } from "./Date";

export const scrollToDay = (date: string) => {
  setTimeout(() => {
    const monthEl = document.getElementById(`day-${date}`);
    const monthIn = document.getElementById(`Board`);
    const el = monthEl?.getBoundingClientRect().y!;
    const ini = monthIn?.getBoundingClientRect().y!;
    window.scroll({ top: el - ini - 28, behavior: "smooth" });
  }, 100);
};
