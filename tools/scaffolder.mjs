import fs from "fs-extra";
import { Eta } from "eta";
import path from "path";

export class Scaffolder {
  constructor({ templatesDir, outputDir }) {
    this.templatesDir = templatesDir;
    this.outputDir = outputDir;
  }

  interpolate({ string, locals }) {
    try {
      const eta = new Eta({});
      return eta.renderString(string, locals);
    } catch (e) {
      console.error(e);
      console.warn("Problem using Eta, returning unmodified content");
      return string
    }
  }

  // Shortcut method that will perform string interpolation and file creation
  apply({ templatesPaths, locals }) {
    templatesPaths.forEach(templatePath => {
      // Get the raw content of the template
      const rawContent = this.readFromFile(path.join(this.templatesDir, templatePath));

      // Interpolate the path of the template so that we know where to write the content
      const fpath = this.interpolate({ string: templatePath, locals });
      const content = this.interpolate({ string: rawContent, locals });

      this.writeToFile(path.join(this.outputDir, fpath), content);
    });
  }

  readFromFile(fPath) {
    fs.mkdirSync(path.dirname(fPath), { recursive: true });
    return fs.readFileSync(fPath).toString();
  }

  writeToFile(fPath, content) {
    console.info(`Modifying ${fPath}`);
    fs.mkdirSync(path.dirname(fPath), { recursive: true });
    fs.writeFileSync(fPath, content);
  }
}
