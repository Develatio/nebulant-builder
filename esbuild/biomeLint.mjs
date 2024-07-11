import fs from "fs-extra";
import { Biome, Distribution } from "@biomejs/js-api";

export function biomeLint() {
  return {
    name: "biomeLint",
    setup: async ({ onLoad, onEnd }) => {
      const biome = await Biome.create({
        distribution: Distribution.NODE,
      });

      //biome.registerProjectFolder("/code/src");
      // This doesn't work because "¯\_(ツ)_/¯ fuck you on line 420".
      // I can't deal with debugging biome's rust code compiled to wasm,
      // embedded in ts, packaged inside a god-knows-what latest js-format that
      // will be deprecated before it's even adopted by Node.
      //
      // sigh... I'm so fucking tired of every single library / framework / tool
      // not working...
      // workaround:
      biome.workspace.registerProjectFolder({
        path: "/code/src",
        setAsCurrentWorkspace: true,
      });
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
