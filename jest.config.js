const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  roots: ["<rootDir>/tests/"],
  testMatch: [ "<rootDir>/tests/**/(*.)+(spec|test).[jt]s?(x)"],
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', { configFile: path.resolve(__dirname, '.babelrc') }] ,
    '^.+\\.(css|less)$': '<rootDir>/config/jest/cssTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!unified)/',
  ],
};
