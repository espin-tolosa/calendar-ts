import * as read_headers from "@/entities/secure-login/read-headers";
import * as status_login from "@/entities/presentation/status-login";

//! Testing Cookies Utilities
const createURI = (token: string) =>
  `762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token}%22%7D`;
const cookiesBody = {
  PHPSESSID: "PHPSESSID=3fc65ec6c17a9cb6482be8378a6414fb",
  encodedJWT:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE4NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.h4fW-B6AMzn18ZHwKnay9mEryBh1Q1TOo-aJYcp3epk",
  expiredJWT:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDAwMDAwMDAsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.y7clstlVYowo0wi17wC8WjwUUfGLqovCZb8bnMT_-EM",
  invalidJWT:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE4NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVzciI6InNhbXVlbCIsImF1dCI6InJlYWQtd3JpdGUiLCJydXMiOiJhbGwifX0.Wp5tV2uYr_R42-6-t-Zr3UOh2ZMAT1U0yK7huZVacAs",
  typeerrorJWT:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE4NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6MSwidXNyIjoic2FtdWVsIiwiYXV0IjoicmVhZC13cml0ZSIsInJ1cyI6ImFsbCJ9fQ.0iWwQ8CiSN_-SLCLrvB1JCiMPCBa6kSRSoOsWznkz9I",
};

const cookies = {
  sessid: {
    uri: cookiesBody.PHPSESSID,
  },

  valid_jwt: {
    decoded: {
      exp: 1850886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        uid: "1",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
    },
    encoded: cookiesBody.encodedJWT,
    uri: createURI(cookiesBody.encodedJWT),
  },
  expired_jwt: {
    decoded: {
      exp: 1600000000,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        uid: "1",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
    },
    encoded: cookiesBody.expiredJWT,
    uri: createURI(cookiesBody.expiredJWT),
  },
  invalid_jwt: {
    decoded: {
      exp: 1850886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
    },
    encoded: cookiesBody.invalidJWT,
    uri: createURI(cookiesBody.invalidJWT),
  },
  typeerror_jwt: {
    decoded: {
      exp: 1850886558,
      aud: "6eee49870e5c6989f577212ccad87a71bcfc7bff",
      data: {
        iss: "localhost",
        uid: 1,
        usr: "samuel",
        aut: "read-write",
        rus: "all",
      },
    },
    encoded: cookiesBody.typeerrorJWT,
    uri: createURI(cookiesBody.typeerrorJWT),
  },
};

//! Test Tool
export const Test = {
  read_headers: read_headers.default, //communication layer
  status_login: status_login.default, //presentation layer
  cookies,
};
