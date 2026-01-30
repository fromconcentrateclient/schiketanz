// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// determine if we are running 'astro build'
const isBuild = process.argv.includes('build');

export default defineConfig({
  site: 'https://schiketanz.fromconcentrate.ca',
  output: 'server',
  // Netlify adapter when building for production
  // Astro's own Node server in dev
  adapter: isBuild ? netlify() : undefined,
  integrations: [
    react(),
    mdx(),
    keystatic(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});