import { createContext, useState, useContext, useCallback } from "react";

const CounterStepContext = createContext(1);

type CounterStepProvider = {
  children: React.ReactNode;
  step: number;
};

export const CounterStepProvider = ({
  step,
  children,
}: CounterStepProvider) => (
  <CounterStepContext.Provider value={step}>
    {children}
  </CounterStepContext.Provider>
);

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const step = useContext(CounterStepContext);
  const increment = useCallback(() => setCount((x) => x + step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  return { count, increment, reset };
}
