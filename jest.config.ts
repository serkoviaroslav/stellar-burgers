import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'jest-css-modules-transform',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx'
        }
      }
    ]
  }
};

export default config;