/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ['./node_modules/', './modules/'],
  clearMocks: true,
  moduleNameMapper: {
    //Represent absolute path with symbol @
    "@/(.*)": "<rootDir>/src/$1",
  },
};
