module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],
  testMatch: [
    '**/?(*.)+(spec|test).(js|ts|tsx)'
  ]
};
