import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import viteYaml from '@modyfi/vite-plugin-yaml';
import manifest from './manifest';
import npmPackage from './package';

const extensionManifest = {
  version: npmPackage.version,
  ...manifest,
};

const e2eTestManifest = {
  ...extensionManifest,
  host_permissions: ['<all_urls>'],
};

export default defineConfig(({ mode }) => ({
  plugins: [
    preact(),
    viteYaml(),
    crx({
      manifest: mode === 'e2e' ? e2eTestManifest : extensionManifest,
    }),
  ],
}));
