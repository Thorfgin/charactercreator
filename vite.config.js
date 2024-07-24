/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    base: '',
    publicDir: 'public',
    build: {
        copyPublicDir: true,
    },
    test: {
        name: 'node',
        root: './__tests__',
        environment: 'node',
        globals: true,
        clearMocks: true, // Clear mocks before each test
        collectCoverage: true, // Enable coverage collection
        coverage: {
            provider: 'v8', // Use V8 coverage provider (default)
            reportsDirectory: 'coverage', // Directory for coverage reports
            include: ['src/**/*.{js,ts,jsx,tsx}'], // Files to include in coverage
            exclude: ['node_modules/**', 'test/**'], // Files to exclude from coverage
        },
        roots: ['<rootDir>', '<rootDir>/src'], // Directories to search for tests
        include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'], // Test file patterns
        exclude: ['node_modules'], // Exclude node_modules from tests
        setupFiles: [], // Files to run before tests
        setupFilesAfterEnv: [], // Files to run after environment setup
        transformIgnorePatterns: ['\\\\node_modules\\\\'], // Ignore patterns for transformation
    },

    // Enable CSS support
    css: {
        modules: false,
        // Extract CSS into a separate file for production builds
        // Setting this to `true` generates a separate CSS file.
        extract: true,
    },
})
