module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
