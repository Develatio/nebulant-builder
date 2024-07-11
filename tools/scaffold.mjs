import to from "to-case";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { select, input } from "@inquirer/prompts";
import { Scaffolder } from "./scaffolder.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const vars = {};

  vars.nodeConnectionsType = await select({
      message: "Node connections type",
      choices: [
        { name: "OneInOneOut", value: "OneInOneOut" },
        { name: "OneInTwoOut", value: "OneInTwoOut" },
      ],
    }),

  vars.provider = await select({
      message: "Provider",
      choices: [
        { label: "executionControl", value: "executionControl" },
        { label: "generic", value: "generic" },
        { label: "aws", value: "aws" },
        { label: "hetznerCloud", value: "hetznerCloud" },
      ],
    }),

  vars.rawNodeName = await input({ message: "Name of the node (AllocateAddress, RunInstance, ...)" }),

  vars.nodeLabel = await input({
    message: "Label of the node (Create elastic IP, Run machine)",
    default: to.sentence(vars.rawNodeName),
  });

  vars.actionName = await input({
    message: "Name of the CLI action (set_region, run_instance, findone_server)",
    default: to.snake(vars.rawNodeName),
  });

  vars.iconName = await input({ message: "Icon name (without the extension)" });

  vars.generatorID = await input({
    message: "Generator ID",
    default: to.slug(vars.rawNodeName),
  });

  // Initialize the scaffolder and the AST patcher
  const scaffolder = new Scaffolder({
    templatesDir: path.join(__dirname, "templates"),
    outputDir: path.join(__dirname, ".."),
  });

  // Create all required vars (we'll use these to interpolate the templates)
  const locals = {
    ...vars,

    providerDashcase: to.slug(vars.provider),      // execution-control
    providerCapitalized: to.pascal(vars.provider), // ExecutionControl
    providerHuman: to.sentence(vars.provider),     // Execution control,
    generatorId: vars.generatorID,                 // find-vpc
  };

  // Set all the templates paths
  let templatesPaths = [
    "src/components/ddWidgets/<%= it.provider %>/<%= it.rawNodeName %>.js",
    "src/components/implementations/<%= it.provider %>/<%= it.rawNodeName %>.js",
    "src/components/settings/<%= it.provider %>/<%= it.rawNodeName %>Settings.jsx",
    "src/components/shapes/rectangle/vertical/<%= it.provider %>/<%= it.rawNodeName %>.js",
    "src/components/blueprintGenerators/<%= it.provider %>/<%= it.rawNodeName %>Generator.js",
  ];

  // Generate the new files from the templates
  scaffolder.apply({ templatesPaths, locals });
}

main();
