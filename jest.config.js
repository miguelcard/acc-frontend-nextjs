/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        // Resolve the @/ path alias used throughout the Next.js project.
        '^@/(.*)$': '<rootDir>/$1',
    },
    // Only run files under __tests__ or matching .test.ts(x)
    testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
    },
};

module.exports = config;
