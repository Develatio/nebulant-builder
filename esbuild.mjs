// Gulp, grunt, the 5 different (breaking) versions of webpack, rspack, vite and
// only God knows how many more shitty bundlers I had to deal with. I'm so, so,
// **SO** fucking sick and tired of all the genuine clusterfuck that the entire
// JS ecosystem has become that I don't even think there are enough words in
// this language to describe how I feel.
// Why can't you (the community) just build something that just fucking works
// and not touch it ever again? It's beyond my comprehension.
// How hard can it be? Bundle the js files. Bundle the images. Maybe some css or
// scss. An index.html that should work as an entrypoint. That's fucking all.
// WHY DOES IT HAVE TO BE 8129 DEPENDENCIES INVOLVING node-gyp, gcc, make AND
// WHO KNOWS HOW MANY MORE SHIT THAT WAS DRAGGED BECAUSE OF OTHER SHIT THAT WAS
// DRAGGED BECAUSE YOU'RE TOO FUCKING LAZY TO WRITE 2 LINES OF CODE AND INSTEAD
// YOU CHOSE TO ADD YET ANOTHER USELESS PACKAGE TO CHECK IF A bool IS TRUE OR
// FALSE. WHY DO I NEED A FUCKING C++ COMPILER JUST TO BUNDLE SOME SCSS. OMFG
// WHY IS EVERYTHING IN THIS SHITTY LANGUAGE SO FUCKING BROKEN!? **WHY?**
//
// sigh
//
// Look at this. It's my own bundler (based on esbuild, ofc). Around 500 lines,
// including all the plugins (that I wrote). It just works. Why can't we have
// simple things like this?

import http from "http";
import mime from "mime";
import fs from "fs-extra";
import path, { dirname } from "path";
import url, { fileURLToPath } from "url";

import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

import { getEnvs } from "./esbuild/getEnvs.mjs";
import { handleSW } from "./esbuild/handleSW.mjs";
import { handleSVG } from "./esbuild/handleSVG.mjs";
import { biomeLint } from "./esbuild/biomeLint.mjs";
import { importGlob } from "./esbuild/importGlob.mjs";
import { generateIndexAfterRebuild } from "./esbuild/generateIndexAfterRebuild.mjs";

const production = ["production", "staging"].includes(process.env.NODE_ENV);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __srcroot = path.resolve(__dirname, "src") + "/";

const isWatch = process.argv.includes("--watch");

let SSE = null;

export const plugins = [
  generateIndexAfterRebuild(),
  sassPlugin({
    embedded: true,
    importMapper: (filepath) => {
      // This doesn't work because https://github.com/glromeo/esbuild-sass-plugin/issues/136
      // const transformed = filepath.replace(/^@src\//, __srcroot)
      //
      // Workaround:
      const transformed = filepath.replace(/^(.*?)@src\//, __srcroot);
      // console.log(`Received ${filepath} --> converting to ${transformed}`);
      return transformed;
    },
    async transform(source) {
      const { css } = await postcss([
        autoprefixer,
        postcssPresetEnv({ stage: 0 }),
      ]).process(source, {
        from: undefined,
      });

      return css;
    }
  }),
  handleSVG({
    jsxRuntime: "automatic",
    dimensions: false,
    memo: true,
    plugins: ["@svgr/plugin-jsx"],
    svgoConfig: {
      plugins: [{
        name: "preset-default",
        params: {
          overrides: {
            convertTransform: false,
            cleanupIDs: false,
          },
        },
      }],
    }
  }),
  biomeLint(),
  handleSW(),
  importGlob(),
  autoreload(),
];

export const buildParams = {
  color: true,
  entryPoints: [
    "src/main.jsx",
  ].concat(production ? [] : [
    "src/playground.jsx"
  ]),
  loader: {
    ".js": "jsx",
    ".json": "json",
    ".png": "file",
    ".jpeg": "file",
    ".jpg": "file",
    ".svg": "file",
    ".woff": "file",
    ".woff2": "file",
    ".ttf": "file",
    ".wasm": "file",
  },
  outdir: "dist",
  absWorkingDir: path.resolve(__dirname),
  entryNames: "[dir]/[name].[hash]",
  assetNames: "[dir]/[name].[hash]",
  minify: production,
  treeShaking: production,
  sourcemap: true,
  sourcesContent: process.env.NODE_ENV === "development",
  format: "esm",
  jsx: "automatic",
  bundle: true,
  metafile: true,
  resolveExtensions: ['.js', '.jsx', '.scss', '.css'],
  define: getEnvs(),
  logLevel: "error",
  plugins,
  //target: ['chrome114', 'firefox125', 'safari17', 'edge114'],
};

function autoreload() {
  return {
    name: 'autoreload',
    setup(build) {
      build.onEnd(() => { SSE?.write?.("data: change\n\n") });
    },
  };
}

// Clean build folder and copy public folder into build folder
fs.emptyDirSync(path.resolve(__dirname, "dist"));
fs.copySync("public", "dist");

if(isWatch) {
  const ctx = await esbuild.context(buildParams);

  ctx.watch();

  // Yeah, I could have just done ctx.serve()... but the creator of esbuild
  // thought it's a good idea to REBUILD the entire project **every fucking
  // time** a new request is received, without the option to disable it.[0]
  // ARE YOU SHITTING ME RIGHT NOW¿? HOW ON EARTH IS THAT A GOOD IDEA¿?¿?¿?
  // OMFG WHY¿? Just **WHY**¿?
  // There are some people that just wake up in the morning and choose violence.
  // [0]: https://esbuild.github.io/api/#serve

  // Create HTTP server
  const HOST = '0.0.0.0';
  const PORT = 8080;
  http.createServer({}, async (req, res) => {
    let filePath = url.parse(req.url).pathname;
    if(filePath === "/") {
      filePath = path.join(__dirname, "dist", "index.html");
    } else if(filePath === "/playground") {
      filePath = path.join(__dirname, "dist", "playground.html");
    } else if(filePath === "/fswatch") {
      SSE = res;
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      // Keep the conn alive
      setInterval(() => SSE.write(":\n\n"), 10000);
      return;
    } else {
      filePath = path.join(__dirname, "dist", filePath)
    }

    // Check if the requested file exists
    try {
      await fs.access(filePath);
      // File exists, serve it
      const contentType = mime.getType(filePath) || 'application/octet-stream';
      res.writeHead(200, {
        "Content-type": contentType,
      })
      fs.createReadStream(filePath).pipe(res);
    } catch (_error) {
      // File does not exist, return 404
      res.writeHead(404);
      res.end('File not found');
    }
  }).listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
} else {
  // Run build
  await esbuild.build(buildParams).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
