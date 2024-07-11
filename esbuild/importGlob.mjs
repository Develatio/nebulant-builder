import fs from "fs-extra";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __srcroot = path.resolve(__dirname, "..", "src") + "/";

// This happens when the language you're using doesn't provide you with some
// sane way for importing everything... *sigh*

export function importGlob() {
  return {
    name: 'require-context',
    setup: (build) => {
      build.onResolve({ filter: /\*/ }, async (args) => {
        const resolved = args.path.replace(/^(.*?)@src\//, __srcroot);

        return {
          path: resolved,
          namespace: 'import-glob',
          pluginData: {
            resolveDir: path.dirname(resolved),
          },
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'import-glob' }, async (args) => {
        const dir = args.pluginData.resolveDir;
        const importerCode = fs.readdirSync(dir).filter(
          fname => fname.endsWith(".js")
        ).map(
          fname => path.join(dir, fname)
        ).map(
          module => `export * from '${module}'`
        ).join(';\n');

        return { contents: importerCode, resolveDir: dir };
      });
    }
  }
};
