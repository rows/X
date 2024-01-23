import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";

export default defineConfig({
  plugins: [
    preact(),
    crx({
      manifest,
    }),
  ],
});
