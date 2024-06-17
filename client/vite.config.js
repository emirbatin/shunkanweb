import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.REACT_APP_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['socket.io-client']
    }
  },
  define: {
    'process.env': {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_FLASK_URL: process.env.REACT_APP_FLASK_URL,
    },
  },
});
