/** @jest-environment jsdom */
import { ExternalParser, Token } from "@/classes/token";
import { CustomValues } from "@/customTypes";
import { encodedTokenFromAPI, event } from "@/interfaces";
import {
  parseURITokens,
  recoverEncodedTokensFromCookies,
} from "@/io/cookieStorage";

function mockAnyDataAs<T = unknown>(data: any): T {
  return JSON.parse(JSON.stringify(data));
}

//Object.defineProperty(window.document, "cookie", {
//  writable: true,
//  value:
//    "PHPSESSID=5c1b4b23b3068cf9558ec2129aa320b6; 5ca5ade74b8328dd482fb0e863b0e8a3=%7B%22data%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTA4ODM2NTksImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.99M5ejQmdR6HKhkFhq1dCBq_6DTmc0M-eVxMOwzixUg%22%7D",
//});
//
//test("Within 31 days from 01 of march will be 01 of april", () => {
//  const encodedTokens = recoverEncodedTokensFromCookies();
//  const uriParsedTokens = parseURITokens(encodedTokens);
//
//  //console.log(uriParsedTokens);
//});
//
describe("Testing custom object instances", () => {
  test("Multiple instances of Null Token create different objects each time", () => {
    const token1 = CustomValues.nullToken();
    const token2 = CustomValues.nullToken();
    expect(token1).not.toBe(token2);
  });
  test("Multiple instances of Null Encoded Token create different objects each time", () => {
    const token1 = CustomValues.nullEncodedToken();
    const token2 = CustomValues.nullEncodedToken();
    expect(token1).not.toBe(token2);
  });
  test("instantiating independent nullEvent objects", () => {
    const token1 = CustomValues.nullEvent;
    const token2 = CustomValues.nullEvent;
    expect(token1).not.toBe(token2);
  });
});

describe("Testing Parser of Token from External API", () => {
  //

  test("Parse any given invalid data as nullToken", () => {
    const invalidToken = mockAnyDataAs<encodedTokenFromAPI>({});
    const result = ExternalParser.fromTokenPHP(invalidToken);
    expect(result).toStrictEqual(CustomValues.nullToken());
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
    expect(result).toEqual(CustomValues.nullToken());
  });

  test("Parse a incoplete token from External Parser API as nullToken", () => {
    const validToken = mockAnyDataAs<encodedTokenFromAPI>({
      data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEyNTA4ODY1NTgsImRhdGEiOnsiaXNzIjoibG9jYWxob3N0IiwidXNyIjoic2FtdWVsIiwiYXV0IjoicmVhZC13cml0ZSIsInJ1cyI6ImFsbCJ9fQ.wRvVQoOCz4XV6lf92k9dQcw8qaGdQA2hffOo-hY5tC4",
    });
    const result = ExternalParser.fromTokenPHP(validToken);
    expect(result).toEqual(CustomValues.nullToken());
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
