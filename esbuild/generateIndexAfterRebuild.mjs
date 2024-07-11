import fs from "fs-extra";
import { Eta } from "eta";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const production = ["production", "staging"].includes(process.env.NODE_ENV);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __projroot = path.resolve(__dirname, "..") + "/";

function extractAssetsLinks(metafile, entrypoint) {
  const entrypoints = Object.entries(metafile.outputs).filter(
    ([_, obj]) => obj.entryPoint == entrypoint
  ).map(
    ([path, obj]) => ({ path, obj })
  );

  return entrypoints.reduce((acc, entrypoint) => {
    // Strip the output folder from the URLs
    acc.push(entrypoint.path.replace("dist/", "/"));
    if(entrypoint.obj.cssBundle) {
      acc.push(entrypoint.obj.cssBundle.replace("dist/", "/"));
    }
    return acc;
  }, []);
}

function interpolate(src, dst, context) {
  let content = fs.readFileSync(path.resolve(__projroot, src), "utf-8");
  const eta = new Eta({});
  content = eta.renderString(content, context);
  fs.writeFileSync(path.resolve(__projroot, dst), content, "utf-8");
}

export function generateIndexAfterRebuild() {
  return {
    name: "generate-index-after-rebuild",
    setup(build) {
      build.onStart(() => {
        console.log(`⚡ [esbuild] Building`);
        console.time("⚡ [esbuild] Done");
      });

      build.onEnd((res) => {
        if(res.errors.length > 0) {
          console.timeEnd("⚡ [esbuild] Done");
          console.error("An unexpected error ocurred. Check logs...");
          return;
        }

        interpolate("./public/index.html", "./dist/index.html", {
          outputs: extractAssetsLinks(res.metafile, "src/main.jsx"),
        });

        if(!production) {
          interpolate("./public/playground.html", "./dist/playground.html", {
            outputs: extractAssetsLinks(res.metafile, "src/playground.jsx"),
          });
        }

        const metaPath = path.resolve(__projroot, "dist", "meta.json");
        fs.writeFileSync(metaPath, JSON.stringify(res.metafile));

        console.timeEnd("⚡ [esbuild] Done");
      });
    }
  }
}
