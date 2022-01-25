export const giveMeColor = (client: string) => {
  const linearGradientTemplate = (color: number) => {
    return `linear-gradient(0.25turn, hsl(${color}, 40%, 40%), hsl(${color},50%,50%),  hsl(${color}, 60%, 60%))`;
  };

  const highContrastText = (bgColor: number) => {
    // hsl system colors are in range [0º, 360º]
    return "white";
  };

  if (client === "John") {
    return {
      background: linearGradientTemplate(10),
      color: highContrastText(10),
    };
  } else if (client === "Cristine") {
    return {
      background: linearGradientTemplate(20),
      color: highContrastText(20),
    };
  } else if (client === "Xin") {
    return {
      background: linearGradientTemplate(30),
      color: highContrastText(30),
    };
  } else {
    return {
      background: linearGradientTemplate(350),
      color: highContrastText(350),
    };
  }
};
