import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'

export default defineConfig({
	root: './src',
	base: './',
	publicDir: 'public',
	build: {
		outDir: '../dist',
	},
})