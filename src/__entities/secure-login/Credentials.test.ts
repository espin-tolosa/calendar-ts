/** @jest-environment jsdom */
import { Test } from "@/testlib";

//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
});

describe("Testing Class Credentials", () => {
  test("Valid token", () => {
    window.document.cookie = `
		${Test.cookies.sessid.uri};
		${Test.cookies.jwt.uri}`;

    const test = Test.read_headers.credentials();
    expect(test.isValid()).toBe(true);
  });
  test("No cookies in document", () => {
    window.document.cookie = "";

    const test = Test.read_headers.credentials();
    expect(test.isValid()).toBe(false);
  });
});
