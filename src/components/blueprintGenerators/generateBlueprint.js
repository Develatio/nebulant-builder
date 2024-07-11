import semverGt from "semver/functions/gt";

import { scrub } from "@src/utils/scrub";
import { Logger } from "@src/core/Logger";

import * as generic from "@src/components/blueprintGenerators/generic/*";
import * as executionControl from "@src/components/blueprintGenerators/executionControl/*";

import * as aws from "@src/components/blueprintGenerators/aws/*";

// Hetzner... I really love your services (this is hosted in your servers!), but
// oh my... please add json struct tags to your bindings so I don't have to deal
// with_all thePossible CasesThat_exist OUT_THERE IN_your BinDings...
// Also, please fix the entire "subnet" feature. Not being able to assign
// resources to a subnet is...,
// Oh, also, can you expose some actually usefull data in your /images endpoint,
// (the same data that you use in your "_fe" endpoint) so I can show some good
// texts to the users.
import * as hetznerCloud from "@src/components/blueprintGenerators/hetznerCloud/*";

import { MIN_CLI_VERSION } from "@src/utils/constants";

const generatorsMap = {};
const logger = new Logger();

Object.entries({
  aws,
  generic,
  hetznerCloud,
  executionControl,
}).forEach(([provider, generators]) => {
  // provider == "aws"
  // generators == an object of generators
  logger.log(`Loading generators from ${provider}...`);
  Object.entries(generators).forEach(([generatorName, generatorCode]) => {
    // generatorName == "AllocateAddressGenerator"
    // generatorCode == an object with keys "ID" and <generatorName> (a class)
    if(!generatorCode.ID) {
      logger.log(`\tSkipping ${generatorName}, this could be a base generator...`);
      return;
    }

    logger.log(`\tRegistering ${generatorName} -> ${generatorCode.ID} generator...`);
    generatorsMap[`${generatorCode.PROVIDER}-${generatorCode.ID}`] = generatorCode;
  });
});

export const generateBlueprint = (diagram) => {
  // The keys are composed as `${source}-${port}` and the values are arrays of
  // target IDs.
  const targets = {};

  // Fill the "targets" hashmap
  diagram.cells.forEach(cell => {
    if(!cell.type.startsWith("nebulant.link")) return;

    const link = cell; // alias for better readability
    const key = `${link.source.id}-${link.source.port}`;
    if(!(key in targets)) {
      targets[key] = [];
    }

    targets[key].push(link.target.id);
  });

  const blueprint = {
    actions: [],
    min_cli_version: MIN_CLI_VERSION,
    isValid: true,
  };

  // Generate the blueprint
  for (let node of diagram.cells) {
    if(node.type.startsWith("nebulant.link")) continue;

    const { data } = node;

    let node_data = {};
    if(generatorsMap[`${data.provider}-${data.id}`]) {
      const generator = new generatorsMap[`${data.provider}-${data.id}`]();
      try {
        logger.debug(`Generating blueprint action for node ${data.provider}-${data.id}`);
        node_data = generator.generate(node);
        const _min_cli_version = generator.getMinCliVersion();
        if(semverGt(_min_cli_version, blueprint.min_cli_version)) {
          logger.info(`The blueprint has a min_cli_version ${blueprint.min_cli_version}, but the generated action requires ${_min_cli_version}. Increasing min_cli_version in blueprint.`)
          blueprint.min_cli_version = _min_cli_version;
        }
      } catch (error) {
        logger.critical(`There was an error while generating the blueprint action: ${error?.message}`);
        logger.debug(`The content of the node is:`);
        logger.debug(scrub(data));
        logger.critical("Diagram can't be generated. Aborting...");
        blueprint.isValid = false;
        break;
      }
    } else {
      logger.critical(`Couldn't find generator for ${data.provider}-${data.id}.`);
      logger.critical("Diagram can't be generated. Aborting...");
      blueprint.isValid = false;
      break;
    }

    // Find the ports (and their groups) of the current node
    const ports = Object.fromEntries(node.ports.items.map(port => [port.group, port.id]));

    // The builder has the concept of "executionControl" provider, but the CLI
    // doesn't (CLI's POV is that any non-specific actions are "generic").
    // That's why we "monkey-patch" this value at the very last moment, right
    // before actually creating the action object.
    if(data.provider == "executionControl") {
      data.provider = "generic";
    }

    const cli_node = {
      action_id: node.id,
      provider: data.provider,
      version: data.version,
      ...node_data,
      next_action: {
        // If either "out-false" or "out-true" are not null, we want the "ok"
        // key to have an object value containing the "true" and "false" keys,
        // which should contain (each one) an array of node UUIDs for the
        // "false" and "true" ports...
        //
        // ... else, generate the usual array of node UUIDs for the "ok" port
        ok: (ports["out-false"] || ports["out-true"]) ? {
          true: targets[`${node.id}-${ports["out-true"]}`],
          false: targets[`${node.id}-${ports["out-false"]}`],
        } : targets[`${node.id}-${ports["out-ok"]}`],
        ko: targets[`${node.id}-${ports["out-ko"]}`],
      },

      debug_network: !!diagram.debug_network,

      save_raw_results: diagram.autocomplete && data.autocomplete,
    };

    blueprint.actions.push(cli_node);
  }

  return blueprint;
}
