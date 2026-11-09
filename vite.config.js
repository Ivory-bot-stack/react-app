import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' permite subir la carpeta dist a GitHub Pages sin configurar rutas
export default defineConfig({ plugins: [react()], base: './' });
