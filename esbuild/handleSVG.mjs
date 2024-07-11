import fs from "fs-extra";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { transform } from "@svgr/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __srcroot = path.resolve(__dirname, "..", "src") + "/";

export function handleSVG(options = {}) {
  return {
    name: 'handleSVG',
    setup(build) {
      build.onResolve({ filter: /\.svg$/ }, async (args) => {
        const resolved = args.path.replace(/^(.*?)@src\//, __srcroot);
        return {
          path: resolved,
        };
      });

      build.onLoad({ filter: /\.svg$/ }, async (args) => {
        if(args.suffix === "?transform") {
          const svg = fs.readFileSync(args.path, { encoding: 'utf8' });
          const contents = await transform(svg, {
            ...options
          }, {
            filePath: args.path,
          });

          return {
            contents,
            loader: 'jsx',
          };
        }
      });
    },
  };
};
