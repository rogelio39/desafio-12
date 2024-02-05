import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
