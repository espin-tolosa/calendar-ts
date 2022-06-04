/** @jest-environment jsdom */
import { Test } from "@/testlib";

//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: "",
});

describe("Testing Class LoadJWT copy method", () => {
  test("If multiple tokes are found, the one with last expiration is returned", () => {
    window.document.cookie = `
	${Test.cookies.sessid.uri};
	${Test.cookies.expired_jwt.uri}
	${Test.cookies.valid_jwt.uri}`;

    const test = Test.read_headers.loadjwt();
    expect(test.isEmpty()).toBe(true);
  });
});
