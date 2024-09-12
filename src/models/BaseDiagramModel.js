import { dia } from "@joint/core";

import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { CommandManager } from "@src/core/CommandManager";
import {
  Migrator as DiagramMigrator,
} from "@src/components/implementations/base/migrators/DiagramDataMigrator";

export class BaseDiagramModel extends dia.Graph {
  constructor() {
    const runtime = new Runtime();
    const shapes = runtime.get("objects.shapes");

    super(
      {},
      {
        cellNamespace: shapes,
      }
    );

    this.runtime = runtime;
    this.gconfig = new GConfig();
    this.eventBus = new EventBus();
    this.logger = this.runtime.get("objects.logger");

    // create command manager
    this.commandManager = new CommandManager({ graph: this });

    this.commandManager.on("stack:push", () => {
      // If <this> is not the main_model, abort. There might be other models
      // (eg. the autocomplete model) that might be triggering commands, but we
      // don't care about them.
      if(this.runtime.get("objects.main_model") !== this) return;

      //console.log(commands);
      //const actions = commands.map(c => c.action);
      //console.log(actions.join(", "));

      if(this.commandManager.hasRedo()) {
        this.runtime.set("state.ops_counter", 1);
      } else {
        const ops_counter = this.runtime.get("state.ops_counter");
        this.runtime.set("state.ops_counter", ops_counter + 1);
      }

      this.eventBus.publish("BlueprintChange");
    });

    this._defaultAttributes = ["cells", "x", "y", "zoom"];
  }

  reset() {
    this.clear();
    Object.keys(this.attributes).forEach(k => {
      if(!this._defaultAttributes.includes(k)) delete this.attributes[k];
    });
  }

  deserialize(blueprint, opts = { load_autosave: false }) {
    try {
      // Run the base diagram migrator.
      let res;

      if(blueprint.autosave_diagram) {
        res = new DiagramMigrator().migrate({
          data: {
            id: "blueprint",
            diagram: blueprint.autosave_diagram,
            version: blueprint.autosave_diagram_version || "0.0.1",
          },
          node_id: "autosave",
        });

        if(res.success) {
          blueprint.autosave_diagram = res.data.diagram;
          blueprint.autosave_diagram_version = res.data.version;
        } else {
          // We couldn't migrate the diagram... something is really wrong...
          throw new Error("Diagram couldn't be migrated");
        }
      }

      res = new DiagramMigrator().migrate({
        data: {
          id: "blueprint",
          diagram: blueprint.diagram,
          version: blueprint.diagram_version || "0.0.1",
        },
        node_id: "diagram",
      });

      if(res.success) {
        blueprint.diagram = res.data.diagram;
        blueprint.diagram_version = res.data.version;
      } else {
        // We couldn't migrate the diagram... something is really wrong...
        throw new Error("Diagram couldn't be migrated");
      }

      if(opts.load_autosave) {
        this.fromJSON(blueprint.autosave_diagram);
      } else {
        this.fromJSON(blueprint.diagram);
      }

      // Enforce data structure for each node
      const failed_migrations = [];
      for(let node of this.getElements()) {
        // Migrate the settings
        res = node.migrateData();
        if(res.success) {
          node.enforceSettingsStructure({
            use_existing_settings: true,
          });
        } else {
          failed_migrations.push(node);
        }
      }

      if(failed_migrations.length > 0) {
        this.logger.critical(`${failed_migrations.length} migration(s) failed.`);
        this.logger.critical("We strongly discourage you from saving the blueprint in it's current state.");
        this.logger.critical("Doing so will cause data loss.");
        this.logger.critical("Please get in touch with us using our support channels.");

        const msg = `
          ${failed_migrations.length} migration(s) failed.
          We strongly discourage you from saving the blueprint in it's current state.
          Saving the blueprint in it's current state will cause data loss.
        `;

        this.eventBus.publish("crash", { error: msg });
      }

      try {
        if(opts.load_autosave) {
          this.commandManager.fromJSON(blueprint.autosave_cm);
        } else {
          this.commandManager.fromJSON(blueprint.cm);
        }
      } catch (_error) {
        this.commandManager.reset();
      }

      return true;
    } catch (ex) {
      this.logger.error("Diagram deserialization failed!");
      this.logger.error(ex);
      this.eventBus.publish("crash");
      return false;
    }
  }

  serialize() {
    return this.toJSON();
  }

  // Returns the "start" node (or "undefined" if there isn't any)
  getStartNode() {
    return this.getElements().find(node => {
      return node.prop("type").includes("executionControl.Start") && !node.parent()
    });
  }

  // Returns the "end" node (or "undefined" if there isn't any)
  getEndNode() {
    return this.getElements().find(node => {
      return node.prop("type").includes("executionControl.End") && !node.parent()
    });
  }

  // This method will return the neighbors of a node, with a few improvements.
  // First, it will "jump" past the group to which it belongs (if any).
  // Second, it will return the correct neighbors when the element that is
  // currently being visited is a group. JointJS's "getNeighbors()" will return
  // the inner "Start" and "End" nodes, which is not desired in our case.
  // Third, it will return the groups that were visited while reaching the
  // neighbors.
  getNeighborsExceptGroups(node, opt) {
    let nodes = this.getNeighbors(node, opt);
    const groups = nodes.filter(node => node.isGroup());
    nodes = nodes.filter(node => !node.isGroup());

    let group;
    if(node.parent()) {
      group = node.getParentCell();
    }

    groups.forEach(g => {
      if(g.id == group?.id) {
        let neighbors = this.getNeighbors(g, opt);
        if(opt.outbound) {
          // Filter the "Start" node
          const startNode = g.getStartNode();
          neighbors = neighbors.filter(n => n.id !== startNode.id);
        } else if(opt.inbound) {
          // Filter the "End" node
          const endNode = g.getEndNode();
          neighbors = neighbors.filter(n => n.id !== endNode.id);
        }
        nodes.push(...neighbors);
      } else {
        if(opt.outbound) {
          nodes.push(g.getStartNode());
        } else if(opt.inbound) {
          nodes.push(g.getEndNode());
        }
      }
    });

    return { nodes, groups };
  }

  // Returns all nodes that are connected to the "node" node
  getConnectedElements(node = this.getStartNode(), direction = "children") {
    const startingPoint = node;
    const opt = direction == "children" ? { outbound: true } : { inbound: true };

    // While the graph is being initialized there won't be a "Start" node. Just
    // return an empty array in order to avoid blocking other code paths while
    // we're waiting for the "Start" node to be added.
    if(!startingPoint) return [];

    const visited = new Set([]);
    let { nodes, groups } = this.getNeighborsExceptGroups(startingPoint, opt);

    if(startingPoint.isGroup()) {
      nodes = nodes.filter(n => !startingPoint.contains(n.id));
    } else {
      visited.add(startingPoint);
    }

    let queue = nodes;
    groups.forEach(group => visited.add(group));

    while(queue.length > 0) {
      const element = queue.shift();

      if(visited.has(element)) continue;

      visited.add(element);
      ({ nodes, groups } = this.getNeighborsExceptGroups(element, opt));
      queue.push(...nodes);
      groups.forEach(group => visited.add(group));
    }

    // We want to delete the starting node as "getConnectedElements" should not
    // return the starting node itself.
    visited.delete(node);

    return visited;
  }

  // Returns all nodes that are disconnected from the start node
  getDisconnectedElements() {
    const connected = this.getConnectedElements();
    connected.add(this.getStartNode());
    return this.getElements().filter(model => !connected.has(model));
  }

  // Returns a new model that contains only nodes that are connected to the
  // "node" node (either directly or indirectly via other nodes). By default,
  // the "node" node is considered to be the "start" node.
  getCleanModel(node = this.getStartNode(), direction = "children") {
    const cleanModel = new BaseDiagramModel();

    const nodes = [
      { id: node.id },
      ...this.getConnectedElements(node, direction),
    ].map(n => n.id);

    // Add the nodes to the new model
    const parents = {};
    nodes.forEach(id => {
      const cell = this.getCell(id);
      const parent = cell.parent();
      const newCell = cell.clone();

      // We're doing this because we want the cells in the clean model to have
      // the same IDs as the cells from our main model. This way we can easily
      // match / migrate / clone the links from our main model to the cleaned
      // model.
      newCell.prop("id", id, { skip_undo_stack: true });
      if(parent) {
        parents[id] = parent;
      }

      cleanModel.addCell(newCell);
    });
    Object.entries(parents).forEach(([id, parent]) => {
      const n = cleanModel.getCell(id);
      cleanModel.getCell(parent).embed(n);
    });

    // Connect all nodes
    this.getLinks().forEach((link) => {
      const source = link.get("source");
      const target = link.get("target");

      if(nodes.includes(source.id) && nodes.includes(target.id)) {
        const sourceNode = cleanModel.getCell(source.id);
        const sourcePort = sourceNode.getPort(source.port);

        const targetNode = cleanModel.getCell(target.id);
        const targetPort = targetNode.getPort(target.port);

        const newLink = link.clone();
        newLink.source(sourceNode, {
          port: sourcePort.id,
        });
        newLink.target(targetNode, {
          port: targetPort.id,
        });

        // We're doing this because we want the links in the clean model to have
        // the same IDs as the links from our main model.
        newLink.prop("id", link.id, { skip_undo_stack: true });
        cleanModel.addCell(newLink);
      }
    });

    // Make sure to update the "node" variable so it points to what it used to
    // point, but in the new model (cleanModel);
    node = cleanModel.getCell(node.id);

    // Make sure to mark the "Start" node as the main entrypoint (this will be
    // used in the blueprinter).
    const startNode = cleanModel.getStartNode();
    if(startNode) {
      startNode.prop("data/settings/parameters/first_action", true);
    }

    // We must do extra steps for the Groups nodes. We must dettach the links
    // that are connected FROM the OUT ports of the "End" node of the group to
    // the OUT ports of the group and attach them to the nodes that are
    // connected to the OUT ports of the group.
    [...cleanModel.getConnectedElements(node, "children")].filter(
      n => n.isGroup()
    ).map(group => {
      const gstartNode = group.getStartNode();
      if(gstartNode) {
        // Remove the link that connects the "Start" node of the group with the
        // group itself.
        cleanModel.getConnectedLinks(gstartNode, {
          inbound: true,
        }).forEach(link => {
          if(link.getSourceCell().id === group.id) {
            link.remove();
          }
        });

        const shapes = this.runtime.get("objects.shapes");

        // Connect the OUT OK port of the group to the "Start" node.
        const newLink = new shapes.nebulant.link.Simple();
        cleanModel.addCell(newLink);
        newLink.source(group, {
          port: group.getPortByGroup("out-ok").id,
        });
        newLink.target(gstartNode, {
          port: gstartNode.getPortByGroup("in").id,
        });
      }

      // Delete all links connected to the OUT ports of the "End" node of the
      // group.
      const gendNode = group.getEndNode();
      if(gendNode) {
        cleanModel.getConnectedLinks(gendNode, {
          outbound: true,
        }).forEach(link => {
          // Exclude the "Start" node
          if(link.getTargetCell().id === gstartNode?.id) return;

          link.remove();
        });

        // Move all links connected to the OUT ports of the group to the OUT
        // ports of the "End" node of the group.
        cleanModel.getConnectedLinks(group, { outbound: true }).forEach(link => {
          const portGroup = link.getPortGroupOfConnectedNode(group);

          // Exclude the "Start" node
          if(link.getTargetCell().id === gstartNode?.id) return;

          link.source(gendNode, {
            port: gendNode.getPortByGroup(portGroup).id,
          });
        });
      }
    });

    // Debug network requests?
    cleanModel.set("debug_network", this.gconfig.get("advanced.debug_network"));

    return cleanModel;
  }

  // Acts like "findModelsFromPoint", but filters the returned models only to
  // the ones that are visible in a group. If "null" is passed (instead of a
  // group), only parent-less nodes will be returned.
  findModelsFromPointInGroup(point, group = null) {
    let models = this.findModelsFromPoint(point);

    if(group) {
      models = models.filter(m => group.contains(m.id, false));
    } else {
      models = models.filter(m => !m.parent());
    }

    return models;
  }
}
