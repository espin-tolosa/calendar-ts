/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  moduleNameMapper: {
    //Represent absolute path with symbol @
    "@/(.*)": "<rootDir>/src/$1",
  },
};
