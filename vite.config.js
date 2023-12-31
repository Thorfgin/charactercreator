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

    // Enable CSS support
    css: {
        modules: false,
        // Extract CSS into a separate file for production builds
        // Setting this to `true` generates a separate CSS file.
        extract: true,
    },
})
