/** @jest-environment jsdom */
import React from "react";
import { IsDraggingEvent, useIsDragging } from "@/hooks/useIsDragging";
import { renderHook, act } from "@testing-library/react-hooks";

describe("Context test", () => {
  //Disable  console.error for this describe scope: source https://stackoverflow.com/a/58717352/11231828
  //!Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("Testing: isDragging hook switch state false -> true", () => {
    //Wrapping context
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <IsDraggingEvent>{children}</IsDraggingEvent>
    );
    const { result } = renderHook(() => useIsDragging(), { wrapper });

    //From: false
    expect(result.current.isDragging).toBe(false);

    //set
    act(() => {
      result.current.setIsDragging(true);
    });

    //To: true
    expect(result.current.isDragging).toBe(true);
  });
});
