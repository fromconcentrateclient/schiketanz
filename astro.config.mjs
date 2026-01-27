// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // TODO: switch site URL
  site: 'https://schiketanz.fromconcentrate.ca',
  output: 'server',
  adapter: netlify(),
  integrations: [
    react(),
    keystatic(),
    mdx(),
    sitemap(),
    tailwind(),
  ],
});