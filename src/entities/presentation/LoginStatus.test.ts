/** @jest-environment jsdom */
import { Test } from "@/testlib";

//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
});

//isValid
describe("Testing Class Login Status user is Logged in", () => {
  test("Gives true if valid token is available", () => {
    window.document.cookie = `
		${Test.cookies.sessid.uri};
		${Test.cookies.valid_jwt.uri}`;

    const test = Test.status_login.loginstatus();
    expect(test.isUserLoggedIn()).toBe(true);
    expect(test.renderTextNodes("user-name")).toBe("user: samuel");
    expect(test.renderTextNodes("login-status")).toBe("Logout");
  });

  test("Gives false if no token is available", () => {
    window.document.cookie = "";

    const test = Test.status_login.loginstatus();
    expect(test.isUserLoggedIn()).toBe(false);
    expect(test.renderTextNodes("user-name")).toBe("invited");
    expect(test.renderTextNodes("login-status")).toBe("Sign-in");
  });
});
