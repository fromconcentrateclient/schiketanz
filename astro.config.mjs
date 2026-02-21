// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://schiketanz.fromconcentrate.ca',
  output: 'static',
  adapter: netlify({
    imageCDN: false 
  }),
  integrations: [
    react(),
    mdx(),
    keystatic(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@keystatic/astro', '@keystatic/core']
    }
  },
});