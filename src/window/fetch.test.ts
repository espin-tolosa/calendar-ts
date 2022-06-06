/** @jest-environment jsdom */
import { Test } from "@/testlib";
import { env } from "process";

// Mock window.document and assign a first value
//Object.defineProperty(window, "cookie", {
//  writable: true,
//  value: "",
//});

describe("Testing environment variables", () => {
  test("App Title under development", () => {
    //process.env.VITE_APP_TITLE = "JHDIARY";
    expect(process.env.API_KEY).toBe("JHDIARY");
  });
});
