// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto"],
      },
      fontWeight: {
        mini: 100,
        small: 300,
        regular: 400,
        medium: 700,
        extra: 900,
      },
      screens: {
        custombp: { raw: "(max-height: 481px)" },
        customtp: { raw: "(max-width: 641px)" },
      },
      colors: {
        palette: {
          lm: "#264653",
          li: "#2a9d8f",
          cc: "#e9c46a",
          ri: "#f4a261",
          rm: "#e76f51",
        },
        background: {
          clear: "#D3DEDC",
          shade: "#92A9BD",
          dark: "#7C99AC",
          contrast: "#FFEFEF",
        },
        gray: {
          clear: "#E5DCC3",
          mid: "#C7BEA2",
          shade: "#AAA492",
          dark: "#9A9483",
          contrast: "#FFEFEF",
        },
      },
      boxShadow: {
        lg: "0px 1px 3px 0px rgba(19, 10, 46, 0.13), 0px 3px 14px 0px rgba(19, 10, 46, 0.03), 0px 8px 32px 0px rgba(19, 10, 46, 0.07), 0px 30px 84px 0px rgba(19, 10, 46, 0.08)",
      },
      backgroundImage: {
        "january-image":
          "url(https://kprofiles.com/wp-content/uploads/2019/10/calendar-january-silocreativo-free.png)",
      },
      spacing: {
        header: "2rem",
      },
      zIndex: {
        // Following config allows extend events as: Event: z-index = 0 (default) < Dayoff: z-index = 1 < ExtendEvent: z-index = 2
        Dayoff: "1",
        ExtendEvent: "2",
        // Used in TopNav and Controller
        TopLayer: "3",
      },
      fontSize: {
        xxs: "0.6rem",
      },
    },
  },
  plugins: [],
};
