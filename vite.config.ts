import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import viteYaml from '@modyfi/vite-plugin-yaml';
import manifest from './manifest';

export default defineConfig({
  plugins: [
    preact(),
    viteYaml(),
    crx({
      manifest,
    }),
  ],
});
