import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { generateBlueprint } from "@src/components/blueprintGenerators/generateBlueprint";

// Autocompleting is cool. And we want this project to be cool. This means that
// we must have autocompleting. I challenge you to refute this logic.
//
// "Ok, but what does this do?"
// Well... Let's first start with the "Ok, but was is autocomplete?" question.
// We call "autocomplete" the ability of the builder to show real-time data
// extracted from any cloud provider that the user is currently using; for
// example, when the user clicks on a dropdown that should allow him/her to pick
// a subnet, the dropdown should (ideally) render the subnets that are currently
// created in the account of the cloud provider that it is being used.
//
// We do this by generating a new blueprint consisting of a [Start] node
// connected to a node that we'll use to generate the results; in this example,
// this would be the [Find subnets] node.
// By enabling the "autocomplete" option in the blueprint, we're instructing the
// CLI to return to the builder whatever the API of the cloud provider returned,
// which in this example would be a list of subnets.
// Once we have the data, we can render it in the dropdown, providing the
// autocomplete feature.

export class BaseAutocompleter {
  constructor({ node, filters, data } = {}) {
    this.logger = new Logger();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();
    this.shapes = this.runtime.get("objects.shapes");
    this.cliConnector = this.runtime.get("objects.cliConnector");
    this.builderAssets = this.runtime.get("objects.builderAssets");
    this.backendConnector = this.runtime.get("objects.backendConnector");

    this.node = node;
    this.filters = filters ?? {};
    this.data = data ?? [];

    const BaseDiagramModel = this.runtime.get("objects.BaseDiagramModel");
    this.model = new BaseDiagramModel();
    this.model.set("autocomplete", true);
    // Debug network requests?
    //this.model.set("debug_network", this.gconfig.get("advanced.debug_network"));

    const startNode = new this.shapes.nebulant.rectangle.vertical.executionControl.Start();
    startNode.enforceSettingsStructure();
    startNode.prop("data/settings/parameters/first_action", true);
    this.model.addCell(startNode);

    this.nodes = [startNode];

    return this;
  }

  appendNode(node) {
    // Add the node to the model
    this.model.addCell(node);

    // Create a link between the previous node and this node
    const newLink = new this.shapes.nebulant.link.Simple();
    this.model.addCell(newLink);
    newLink.source(this.nodes.at(-1), {
      port: this.nodes.at(-1).getPortByGroup("out-ok").id,
    });
    newLink.target(node, {
      port: node.getPortByGroup("in").id,
    });

    this.nodes.push(node);
  }

  // You can override this method if you want full control over the autocomplete
  // functionality. Your implementation must return a promise that should be
  // resolved with an array of objects with "label" / "value" keys.
  //
  // Example:

  // run() {
  //   return new Promise((resolve) => {
  //     const result = [
  //       {
  //         type: "value",
  //         label: "Val 1",
  //         value: "val1",
  //       },
  //       {
  //         type: "value",
  //         label: "Val 2",
  //         value: "val2",
  //       }
  //     ];
  //
  //     setTimeout(() => {
  //       resolve(result);
  //     }, 3000);
  //   });
  // }

  // Override this in order to append nodes to the to-be-executed diagram
  async prerun() {

  }

  async run({ id } = {}) {
    await this.prerun();

    // DEBUG
    //const eventBus = runtime.get("objects.eventBus");
    //eventBus.publish("OpenAutocompletePreview", {
    //  model: autocompleteModel,
    //});

    this.logger.debug("Running autocompleter");

    return new Promise((resolve) => {
      const model = this.model.serialize();
      const { actions, min_cli_version, isValid } = generateBlueprint(model);

      if(!isValid) {
        this.logger.error("Autocompleter won't be executed because the blueprint actions couldn't be generated.");
        this.eventBus.publish("crash");
        resolve({ data: [], total: 0 });
        return;
      }

      // Send request to CLI
      this.cliConnector.autocomplete({
        id,
        blueprint: {
          actions,
          min_cli_version,
        },
      }).then(data => {
        // Save data so we can expose it via getResultOfNode().
        // data is an object of NodeIds as keys and API results as values.
        this.data = data;

        // Process returned data
        const processed_data = this.process();

        // Resolve promise with the processed data
        this.logger.debug(`Autocomplete data is ready! (${processed_data.total} results)`);
        resolve(processed_data);
      }).catch(err => {
        this.logger.error(`Autocompleter failed fetching data! (${err?.message || "Maybe operation was superseded?"})`);
        resolve({ data: [], total: 0 });
      });
    });
  }

  // You can override this method if you want to apply modifications on the
  // data that was resolved by the "run()" method.
  process() {
    return this.data;
  }

  getResultOfNode(node_id) {
    if(node_id in this.data) {
      return this.data[node_id];
    } else {
      this.logger.error("An autocompleter tried to access the results of a node that doesn't exist.")
      return {};
    }
  }
}
