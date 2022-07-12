/** @jest-environment jsdom */
import { Token } from "@/classes/token";
import { nullEncodedToken, nullEvent, nullToken } from "@/customTypes";
import { encodedTokenFromAPI } from "@/interfaces";
import { safeDecodeJWT } from "@/modules/jwt";
import { DocumentIO } from "@/window/cookie";

// Note about testing thread execution:
// after defining some constants and helper functions I need to mock the content of window.document.cookie
// take into account that each time I assign a new value to that mock, it will be available for the rest of the thread execution from this point
// so the paradigm used here is to change it puntually, each change is marked down with a comment, to ease readability.

const token0 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.AIz7jwEXxDMpYdz0VvfoIECXF44gv93yVSS4RXT07iw";
const token1 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.jdB69MJrYAb5j51In0kVqgyyBD1K_TqJ78bIFDRJimg";
/**
 * parse valid token with exp:1700000000
 */
const token2 =
  "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDAwMDAwMDAsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.S9SzUoP1EHTosfU_NmStidvy5VfOUArHJ4oKu0aKAJQ";
/**
 * parse a valid token:
			exp: 1650886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
				uid: "1",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
 */
const token3 = //parse valid token
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.AIz7jwEXxDMpYdz0VvfoIECXF44gv93yVSS4RXT07iw";
/**
 * parse falsy or ill-formed token
 */
const token4 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEyNTA4ODY1NTgsImRhdGEiOnsiaXNzIjoibG9jYWxob3N0IiwidWlkIjoiMSIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.WCEWZBcrafkVaThL0_YfQvDhILZT-nKMUS0o2xd4f6I";

/**
 * parse a valid token:
			exp: 1650886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
				uid: "2",
        usr: "thomas",
        aut: "read",
        rus: "all",
 */
const token5 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEyNTA4ODY1NTgsImRhdGEiOnsiaXNzIjoibG9jYWxob3N0IiwidWlkIjoiMiIsInVzciI6InRob21hcyIsImF1dCI6InJlYWQiLCJydXMiOiJhbGwifX0.EJBfyBnLjdx0OxzSaG8TaJNIISEXzj4B3c7WkhNxKh8";

const expidedPHPSESSID = "PHPSESSID=3fc65ec6c17a9cb6482be8378a6414fb";
const expidedToken = (token: string) =>
  `762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token}%22%7D`;

/**
 * Allows to generate any kind data coming from external api
 * It's usefull to create ill-formed data of certain custom type
 * or event to create valid data as needed
 */

function ExternalData<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data));
}

//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: `
	${expidedPHPSESSID};
	${expidedToken(token0)};
	${expidedToken(token1)};
	${expidedToken(token2)}`,
});

describe("Testing window api read encoded tokens", () => {
  test("Mock document cookies with all kind of cookies expided from server: PHPSESSID and Tokens", () => {
    const tokens = DocumentIO.readTokens();
    const expected = [{ data: token0 }, { data: token1 }, { data: token2 }];

    expect(tokens).toStrictEqual(expected);
  });
});

describe("Testing Token Class", () => {
  test("Get the valid newer Token from cookies with multiple tokens", () => {
    const result = new Token();
    expect(result.data()).toStrictEqual({
      iss: "localhost",
      uid: "1",
      usr: "samuel",
      aut: "read-write",
      rus: "all",
    });
  });
});

describe("Testing custom object instances", () => {
  test("Multiple instances of Null Token create different objects each time", () => {
    const token1 = nullToken();
    const token2 = nullToken();
    token2.aud = "dsa";
    expect(token1).not.toBe(token2);
  });
  test("Multiple instances of Null Encoded Token create different objects each time", () => {
    const token1 = nullEncodedToken();
    const token2 = nullEncodedToken();
    expect(token1).not.toBe(token2);
  });
  test("instantiating independent nullEvent objects", () => {
    const token1 = nullEvent();
    const token2 = nullEvent();
    expect(token1).not.toBe(token2);
  });
});

describe("Testing module wrapper for jwt_decode called safeDecodeJWT", () => {
  test("Parse unexpected data as nullToken", () => {
    const unexpectedToken = ExternalData<encodedTokenFromAPI>({});
    const result = safeDecodeJWT(unexpectedToken);
    expect(result).toStrictEqual(nullToken());
  });

  test("Parse a falsy or ill-formed token as nullToken", () => {
    const illFormedToken = ExternalData<encodedTokenFromAPI>({
      data: "",
    });
    const result = safeDecodeJWT(illFormedToken);
    expect(result).toEqual(nullToken());
  });

  test("Parse an incomplete token as nullToken", () => {
    const validToken = ExternalData<encodedTokenFromAPI>({
      data: token4,
    });
    const result = safeDecodeJWT(validToken);
    expect(result).toEqual(nullToken());
  });

  test("Parse a valid token", () => {
    const validToken = ExternalData<encodedTokenFromAPI>({
      data: token3,
    });
    const result = safeDecodeJWT(validToken);
    expect(result).toEqual({
      exp: 1650886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        uid: "1",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
    });
  });
});

describe("Testing getters methods from Token class with a valid expided token", () => {
  test("Testing get name in case of valid token", () => {
    const token = new Token();
    expect(token.user()).toBe("samuel");
  });

  test("Testing getter isValid expect to be true", () => {
    const token = new Token();
    expect(token.isValid()).toBe(true);
  });

  test("Testing getter isAuth expect to be true", () => {
    const token = new Token();
    expect(token.isAuth()).toBe(true);
  });

  test("Testing null Token method", () => {
    const token = Token.null();

    expect(token.isValid()).toBe(false);
  });

  test("Testing getter is the same user", () => {
    const token = new Token();
    window.document.cookie = `${expidedToken(token5)};`; //!cookie content changed: to simulate another user is now logged
    const other = new Token();
    expect(token.isSameUser(other)).toBe(false);
  });

  test("Testing getter isAuth expect to be false as user is Thomas with aut = read", () => {
    const token = new Token();
    expect(token.isAuth()).toBe(false);
  });
});

describe("Testing getters methods from Token class with a invalid expided token", () => {
  test("Testing get name in case of valid token", () => {
    window.document.cookie = ""; //!cookie content changed: to simulate no cookies stored in document
    const token = new Token();
    expect(token.user()).toBe("invited");
  });

  test("Testing getter isValid expect to be false", () => {
    const token = new Token();
    expect(token.isValid()).toBe(false);
  });

  test("Testing getter isAuth expect to be false", () => {
    const token = new Token();
    expect(token.isAuth()).toBe(false);
  });
});
