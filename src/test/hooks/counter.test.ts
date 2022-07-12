/** @jest-environment jsdom */
import { useCounter } from "@/hooks/templates/counter";
import { renderHook, act } from "@testing-library/react-hooks";

describe("Testing counter hook with React18 with React17 render method", () => {
  //Disable  console.error for this describe scope: source https://stackoverflow.com/a/58717352/11231828
  //!Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {
      return;
    });
  });

  test("should increment counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
