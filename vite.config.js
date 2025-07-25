import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  // ↓↓↓ 加入這個 base 設定 ↓↓↓
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
    },
  },
})