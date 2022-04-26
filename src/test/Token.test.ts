/** @jest-environment jsdom */
import { ExternalParser, Token } from "@/classes/token";
import { nullEncodedToken, nullEvent, nullToken } from "@/customTypes";
import { encodedTokenFromAPI, event, token } from "@/interfaces";
import {
  parseURITokens,
  recoverEncodedTokensFromCookies,
} from "@/io/cookieStorage";

const token0 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.ktUG4M850xD0xXHfrgRlxX9VF5KkPCoYoIB_OQ0ZX_U";
const token1 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.eWgPyvz7BnCNLAqoCqx1bGFrdGUqAPmZzhdQErPLyBU";
const token2 =
  "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDAwMDAwMDAsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.YTbzSVjr8ihHblsdTusL_5lUMLWem72A2R54Gnw7m38";

function mockAnyDataAs<T = unknown>(data: any): T {
  return JSON.parse(JSON.stringify(data));
}

Object.defineProperty(window.document, "cookie", {
  writable: true,
});
//
test("Within 31 days from 01 of march will be 01 of april", () => {
  const token1 =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTA4ODY1NTgsImRhdGEiOnsiaXNzIjoibG9jYWxob3N0IiwidXNyIjoic2FtdWVsIiwiYXV0IjoicmVhZC13cml0ZSIsInJ1cyI6ImFsbCJ9fQ.8YByi-JVJR2mX7PeJuZGo7EmHgs2uA42y4cxhytED58";
  const token2 =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODY1NTgsImRhdGEiOnsiaXNzIjoibG9jYWxob3N0IiwidXNyIjoic2FtdWVsIiwiYXV0IjoicmVhZC13cml0ZSIsInJ1cyI6ImFsbCJ9fQ.iVfEX_VgcHU1Nr95Qyb0vcfHZSTFnvazqn2K1toLuuw";
  window.document.cookie = `PHPSESSID=3fc65ec6c17a9cb6482be8378a6414fb; 762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token1}%22%7D; 762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token2}%22%7D`;
  const encodedTokens = recoverEncodedTokensFromCookies();
  const uriParsedTokens = parseURITokens(encodedTokens);

  //console.log("ANY COOKIES", uriParsedTokens);
});

describe("Testing Token Class", () => {
  test("Get the valid newer Token from cookies with multiple tokens", () => {
    const uriToken = (token: string) =>
      `762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token}%22%7D`;

    window.document.cookie = `PHPSESSID=3fc65ec6c17a9cb6482be8378a6414fb;
		${uriToken(token0)}; ${uriToken(token1)}; ${uriToken(token2)}`;

    const result = new Token();
    expect(result.token).toStrictEqual({
      exp: 1700000000,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
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

describe("Testing Parser of Token from External API", () => {
  //

  test("Parse any given invalid data as nullToken", () => {
    const invalidToken = mockAnyDataAs<encodedTokenFromAPI>({});
    const result = ExternalParser.fromTokenPHP(invalidToken);
    expect(result).toStrictEqual(nullToken());
  });

  test("Parse a Valid Token from External Parser API", () => {
    const validToken = mockAnyDataAs<encodedTokenFromAPI>({
      data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.ktUG4M850xD0xXHfrgRlxX9VF5KkPCoYoIB_OQ0ZX_U",
    });
    const result = ExternalParser.fromTokenPHP(validToken);
    expect(result).toEqual({
      exp: 1650886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
    });
  });

  test("Parse a falsy or malformed token that will throw an InvalidTokenError error within jwt_decode", () => {
    const validToken = mockAnyDataAs<encodedTokenFromAPI>({
      data: "",
    });
    const result = ExternalParser.fromTokenPHP(validToken);
    expect(result).toEqual(nullToken());
  });

  test("Parse a incoplete token from External Parser API as nullToken", () => {
    const validToken = mockAnyDataAs<encodedTokenFromAPI>({
      data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEyNTA4ODY1NTgsImRhdGEiOnsiaXNzIjoibG9jYWxob3N0IiwidXNyIjoic2FtdWVsIiwiYXV0IjoicmVhZC13cml0ZSIsInJ1cyI6ImFsbCJ9fQ.wRvVQoOCz4XV6lf92k9dQcw8qaGdQA2hffOo-hY5tC4",
    });
    const result = ExternalParser.fromTokenPHP(validToken);
    expect(result).toEqual(nullToken());
  });
});
//
//test("No Cookies", () => {
//  window.document.cookie =
//    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
//  const encodedTokens = recoverEncodedTokensFromCookies();
//  const uriParsedTokens = parseURITokens(encodedTokens);
//
//  console.log(uriParsedTokens);
//});
//
//test("Parse a Non Expected Token to nullToken", () => {
//  const mockToken = (cookie: string) => {
//    const fromAPI: encodedTokenFromAPI = JSON.parse(
//      JSON.stringify({ data: cookie })
//    );
//    return fromAPI;
//  };
//  const result1 = mockToken(
//    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
//  );
//  const result2 = mockToken(
//    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEyNTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.5E1BC5w6HLT8A8VYCopvOS5YlcZnSIaBOWABeXLnS-Q"
//  );
//  const result3 = mockToken(
//    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.ktUG4M850xD0xXHfrgRlxX9VF5KkPCoYoIB_OQ0ZX_U"
//  );
//
//  //const result1 = ExternalParser.fromTokenPHP(fromAPI);
//  const myToken = new Token();
//
//  const result = myToken.decodeTokens([result1, result2, result3]);
//
//  console.log("Result");
//  console.log(result);
//});
//
