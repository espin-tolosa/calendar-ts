/** @jest-environment jsdom */
import { Test } from "@/testlib";

//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: `
	${Test.cookies.sessid.uri};
	${Test.cookies.jwt.uri}`,
});

describe("Testing new Token class", () => {
  test("Test empty cookies should set token class to undefined", () => {
    const test = Test.read_headers.loadjwt();
    expect(test.isEmpty()).toBe(false);
  });
});
