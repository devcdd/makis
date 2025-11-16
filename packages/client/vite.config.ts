import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 루트의 .env 파일 로드
  const env = loadEnv(mode, '../..', '');

  return {
    envDir: '../..', // 루트의 .env 파일 참조
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseInt(env.CLIENT_PORT || '4000', 10),
    },
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      tailwindcss(),
    ],
  };
});
