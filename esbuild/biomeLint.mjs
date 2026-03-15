import fs from "fs-extra";
import { Biome } from "@biomejs/js-api/nodejs";

export function biomeLint() {
  return {
    name: "biomeLint",
    setup: async ({ onLoad, onEnd }) => {
      const biome = new Biome();
      biome.openProject("/code/src");
      const filesToLint = [];

      const filter = /\.(?:jsx?|mjs)$/;

      onLoad({ filter }, ({ path }) => {
        if (!path.includes("node_modules")) {
          filesToLint.push(path);
        }

        return null;
      });

      onEnd(() => {
        //filesToLint.forEach(fpath => {
          //const fcontent = fs.readFileSync(fpath).toString();
          //const { diagnostics } = biome.lintContent(fcontent, {
          //  filePath: fpath,
          //});

          //console.log(Object.keys(diagnostics[0]));
          //console.log(diagnostics[0].category);
          //console.log(diagnostics[0].description);

          //console.log(diagnostics[0].advices.advices); // .log[] , .diff{}
          //console.log(diagnostics[0].location); // .path , .span

          // https://github.com/biomejs/biome/discussions/2716
          //biome.printDiagnostics(diagnostics, {
          //  filePath: fpath,
          //  fileSource: fcontent,
          //});
        //});

        return {};
      });
    }
  };
};
