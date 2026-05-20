import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';
import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
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

const yamlPlugin = (): Plugin => ({
  name: 'rows-yaml',
  async load(id) {
    if (!/\.ya?ml$/.test(id)) {
      return null;
    }

    const parsed = yaml.load(await readFile(id, 'utf8'));
    return {
      code: `export default ${JSON.stringify(parsed)};`,
      map: null,
    };
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [
    preact(),
    yamlPlugin(),
    crx({
      manifest: mode === 'e2e' ? e2eTestManifest : extensionManifest,
    }),
  ],
}));
