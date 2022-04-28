/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";
import { CounterStepProvider, useCounter } from "./exampleContext";

//Disable  console.error for this describe scope: source https://stackoverflow.com/a/58717352/11231828
//!Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("should use custom step when incrementing", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CounterStepProvider step={2}>{children}</CounterStepProvider>
  );
  const { result } = renderHook(() => useCounter(), { wrapper });

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
});
