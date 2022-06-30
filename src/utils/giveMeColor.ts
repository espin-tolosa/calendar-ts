export const ClientColorStyles = (h: number, s: number, l: number) => {
  return hsl2rgb(h, s, l);
};

export const giveMeColor = (search: string) => {
  const linearGradientTemplate = (color: number) => {
    return `linear-gradient(0.25turn, hsl(${color}, 40%, 40%), hsl(${color},50%,50%),  hsl(${color}, 60%, 60%))`;
  };

  const highContrastText = (bgColor: number) => {
    // hsl system colors are in range [0º, 360º]
    return "white";
  };

  const ClientsStylesMap = [
    {
      name: "Client_1",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(10),
        color: highContrastText(10),
      },
    },
    {
      name: "Client_2",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(20),
        color: highContrastText(20),
      },
    },
    {
      name: "Client_3",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(30),
        color: highContrastText(30),
      },
    },
    {
      name: "Client_4",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(40),
        color: highContrastText(40),
      },
    },
    {
      name: "Client_5",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(50),
        color: highContrastText(50),
      },
    },
    {
      name: "Client_6",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(60),
        color: highContrastText(60),
      },
    },
    {
      name: "Client_7",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(70),
        color: highContrastText(70),
      },
    },
    {
      name: "Client_8",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(80),
        color: highContrastText(80),
      },
    },
    {
      name: "Client_9",
      style: {
        transition: "background-color 0.5s ease",
        background: linearGradientTemplate(90),
        color: highContrastText(90),
      },
    },
  ];

  const result = ClientsStylesMap.find((client) => client.name === search);

  return result
    ? result.style
    : {
        background: linearGradientTemplate(350),
        color: highContrastText(350),
      };
};

function hsl2rgb(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number, k = (n + h / 30) % 12) =>
    Math.floor(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  return [f(0), f(8), f(4)];
}
