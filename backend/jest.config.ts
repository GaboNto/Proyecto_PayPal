/* eslint-disable prettier/prettier */
import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1', // 👈 permite que Jest entienda los imports con alias 'src/...'
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy', // 👈 ignora estilos si se usan
  },
};

export default config;
