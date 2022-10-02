export const zeroPadd = (number: number) =>
  (number < 10 ? "0" : "") + number.toString();
