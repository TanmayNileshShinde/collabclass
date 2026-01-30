import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        //'/api': {
          //target: env.VITE_BE_URL || 'http://localhost:4000',
         // changeOrigin: true,
        //  secure: false,
        //},
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
  };
});
