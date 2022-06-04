import * as read_headers from "@/entities/secure-login/read-headers";

//! Testing Cookies Utilities
const createURI = (token: string) =>
  `762459e65c7f3357f4009b093d237344=%7B%22data%22%3A%22${token}%22%7D`;
const cookiesBody = {
  PHPSESSID: "PHPSESSID=3fc65ec6c17a9cb6482be8378a6414fb",
  encodedJWT:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE4NTA4ODY1NTgsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.h4fW-B6AMzn18ZHwKnay9mEryBh1Q1TOo-aJYcp3epk",
  expiredJWT:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDAwMDAwMDAsImF1ZCI6IjZlZWU0OTg3MGU1YzY5ODlmNTc3MjEyY2NhZDg3YTcxYmNmYzdiZmYiLCJkYXRhIjp7ImlzcyI6ImxvY2FsaG9zdCIsInVpZCI6IjEiLCJ1c3IiOiJzYW11ZWwiLCJhdXQiOiJyZWFkLXdyaXRlIiwicnVzIjoiYWxsIn19.y7clstlVYowo0wi17wC8WjwUUfGLqovCZb8bnMT_-EM",
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
};

//! Test Tool
export const Test = {
  read_headers: read_headers.default,
  cookies,
};
