/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
	testEnvironment: 'node',
};
