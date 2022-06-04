/** @jest-environment jsdom */
import { Test } from "@/testlib";

const token2025 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.P_8vMNNDQpfJxf65Ra94J64nZnuU4jtmHH85dbzKItE";
const expidedPHPSESSID = "PHPSESSID=3fc65ec6c17a9cb6482be8378a6414fb";
const expidedToken = (token: string) =>
  `762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token}%22%7D`;
//! Mock window.document and assign a first value
Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: `
	${expidedPHPSESSID};
	${expidedToken(token2025)}`,
});

describe("Testing new Token class", () => {
  test("Test empty cookies should set token class to undefined", () => {
    const test = Test.read_headers.credentials();
    expect(test.isValid()).toBe(true);
  });
});
