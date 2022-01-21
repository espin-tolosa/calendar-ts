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
      colors: {
        palette: {
          lm: "#264653",
          li: "#2a9d8f",
          cc: "#e9c46a",
          ri: "#f4a261",
          rm: "#e76f51",
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
    },
  },
  plugins: [],
};
