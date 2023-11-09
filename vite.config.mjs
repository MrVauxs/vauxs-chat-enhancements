import { svelte } from "@sveltejs/vite-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve"; // This resolves NPM modules from node_modules.
import sveltePreprocess from "svelte-preprocess";
import { terserConfig } from "@typhonjs-fvtt/runtime/rollup";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import postcssPresetEnv from "postcss-preset-env"; // Popular postcss plugin for next gen CSS usage.
import cssnano from "cssnano";
import postcssPrefixSelector from "postcss-prefix-selector";
import Icons from "unplugin-icons/vite";

// ATTENTION!
// Please modify the below variables: s_PACKAGE_ID and s_SVELTE_HASH_ID appropriately.

// For convenience, you just need to modify the package ID below as it is used to fill in default proxy settings for
// the dev server.
const s_PACKAGE_ID = "modules/vauxs-chat-enhancements";

// A short additional string to add to Svelte CSS hash values to make yours unique. This reduces the amount of
// duplicated framework CSS overlap between many TRL packages enabled on Foundry VTT at the same time. 'tse' is chosen
// by shortening 'template-svelte-esm'.
const s_SVELTE_HASH_ID = "vce";

const s_COMPRESS = true; // Set to true to compress the module bundle.
const s_SOURCEMAPS = true; // Generate sourcemaps for the bundle (recommended).

// Used in bundling particularly during development. If you npm-link packages to your project add them here.
const s_RESOLVE_CONFIG = {
   browser: true,
   dedupe: ["svelte"],
};

export default () => {
   /** @type {import('vite').UserConfig} */
   return {
      root: "src/", // Source location / esbuild root.
      base: `/${s_PACKAGE_ID}/`, // Base module path that 30001 / served dev directory.
      publicDir: false, // No public resources to copy.
      cacheDir: "../.vite-cache", // Relative from root directory.

      resolve: { conditions: ["import", "browser"] },

      esbuild: {
         target: ["es2022"],
      },

      css: {
         /** @type {import('postcss').postcssConfig} */
         postcss: {
            inject: false,
            sourceMap: s_SOURCEMAPS,
            plugins: [
               // Some plugins, like tailwindcss/nesting, need to run before Tailwind,
               tailwindcss,
               // But others, like autoprefixer, need to run after,
               postcssPrefixSelector({ prefix: ".vce", exclude: [new RegExp("vce.+")] }),
               autoprefixer,
               postcssPresetEnv,
               cssnano,
            ],
         },
      },

      // About server options:
      // - Set to `open` to boolean `false` to not open a browser window automatically. This is useful if you set up a
      // debugger instance in your IDE and launch it with the URL: 'http://localhost:30001/game'.
      //
      // - The top proxy entry redirects requests under the module path for `style.css` and following standard static
      // directories: `assets`, `lang`, and `packs` and will pull those resources from the main Foundry / 30000 server.
      // This is necessary to reference the dev resources as the root is `/src` and there is no public / static
      // resources served with this particular Vite configuration. Modify the proxy rule as necessary for your
      // static resources / project.
      server: {
         port: 30011,
         open: "/game",
         proxy: {
            // Serves static files from main Foundry server.
            [`^(/${s_PACKAGE_ID}/(assets|lang|packs|style.css))`]: "http://localhost:30001",

            // All other paths besides package ID path are served from main Foundry server.
            [`^(?!/${s_PACKAGE_ID}/)`]: "http://localhost:30001",

            // Enable socket.io from main Foundry server.
            "/socket.io": { target: "ws://localhost:30001", ws: true },
         },
      },

      build: {
         outDir: __dirname,
         emptyOutDir: false,
         sourcemap: s_SOURCEMAPS,
         brotliSize: true,
         minify: s_COMPRESS ? "terser" : false,
         target: ["es2022"],
         terserOptions: s_COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
         lib: {
            entry: "./index.js",
            formats: ["es"],
            fileName: "index",
         },
      },

      // Necessary when using the dev server for top-level await usage inside TRL.
      optimizeDeps: {
         esbuildOptions: {
            target: "es2022",
         },
      },

      plugins: [
         svelte({
            preprocess: sveltePreprocess(),
         }),

         Icons({ compiler: "svelte", autoInstall: true }),

         resolve(s_RESOLVE_CONFIG), // Necessary when bundling npm-linked packages.
      ],
   };
};

