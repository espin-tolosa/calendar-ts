/** @jest-environment jsdom */
import { Test } from "@/testlib";

//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
});

//isValid
describe("Testing Class Credentials method isValid", () => {
  test("Valid token gives true back", () => {
    window.document.cookie = `
		${Test.cookies.sessid.uri};
		${Test.cookies.valid_jwt.uri}`;

    const test = Test.read_headers.credentials();
    expect(test.isValid()).toBe(true);
  });
  test("Empty cookies storage gives false back", () => {
    window.document.cookie = "";

    const test = Test.read_headers.credentials();
    expect(test.isValid()).toBe(false);
  });
});

//isAuth
describe("Testing Class Credentials method isAuth", () => {
  test("Check correct auth level in a valid rw token", () => {
    window.document.cookie = `
		${Test.cookies.sessid.uri};
		${Test.cookies.valid_jwt.uri}`;

    const test = Test.read_headers.credentials();
    expect(test.isAuth("rw")).toBe(true);
    expect(test.isAuth("r")).toBe(false);
  });
  test("Empty cookies storage gives false back", () => {
    window.document.cookie = "";

    const test = Test.read_headers.credentials();
    expect(test.isAuth("rw")).toBe(false);
    expect(test.isAuth("r")).toBe(false);
  });
});

//showUser
describe("Testing Class Credentials method showUser", () => {
  test("Show user in a valid token gives user name back", () => {
    window.document.cookie = `
		${Test.cookies.sessid.uri};
		${Test.cookies.valid_jwt.uri}`;

    const test = Test.read_headers.credentials();
    expect(test.showUser()).toBe(Test.cookies.valid_jwt.decoded.data.usr);
  });
  test("Empty cookies storage gives false back", () => {
    window.document.cookie = "";

    const test = Test.read_headers.credentials();
    expect(test.showUser()).toBe("invited");
  });
});

describe("Testing Object Keys while LoadJWT", () => {
  test("Passing a token with a missing key should return an empty token", () => {
    window.document.cookie = `
		${Test.cookies.invalid_jwt.uri}
		`;

    const encoded = Test.read_headers.loadjwt();
    const decoded = Test.read_headers.credentials();
    expect(encoded.isEmpty()).toBe(false); //The token is loaded
    expect(decoded.isValid()).toBe(false); //but it us null
  });
});

describe("Testing Object Keys while LoadJWT", () => {
  test("Passing a token with all expected keys but with an incorrect type should return an empty token", () => {
    window.document.cookie = `
		${Test.cookies.typeerror_jwt.uri}
		`;

    const encoded = Test.read_headers.loadjwt();
    const decoded = Test.read_headers.credentials();
    expect(encoded.isEmpty()).toBe(false); //The token is loaded
    expect(decoded.isValid()).toBe(false); //But it us null
  });
});
