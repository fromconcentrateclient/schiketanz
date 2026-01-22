// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // TODO: switch site URL
  site: 'https://schiketanz.fromconcentrate.ca',

  adapter: netlify(),

  integrations: [react(), keystatic(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});