import { BaseDiagramMigrator } from "./BaseDiagramMigrator";

export class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // Add some properties
    ["1.0.0", (data) => {
      data.diagram.cells = data.diagram.cells.map(node => {
        if(node.type === "nebulant.rectangle.Group") {
          node.type = "nebulant.rectangle.group.Group";
        }

        return node;
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Migrate thread executor
    ["1.0.1", (data) => {
      data.diagram.cells = data.diagram.cells.map(node => {
        if(node.type === "nebulant.rectangle.vertical.executionControl.JoinThreads") {
          node.data = {
            ...node.data,
            id: "join-threads",
            provider: "executionControl",
          };
        }

        return node;
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Add "info" field to all nodes (except the "Sticky notes" node)
    ["1.0.2", (data) => {
      data.diagram.cells.forEach(node => {
        const { type, data } = node;

        if(!data?.settings) return;

        if(type === "nebulant.rectangle.vertical.generic.StickyNote") return;

        data.settings = {
          ...data.settings,
          info: "",
        };
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Delete "provider" field from outputs
    ["1.0.3", (data) => {
      data.diagram.cells.forEach(node => {
        const { data } = node;

        if(!data?.settings?.outputs) return;

        Object.keys(data.settings.outputs).forEach(k => {
          const output = data.settings.outputs[k];
          if(output.provider) {
            output.type = `${output.provider}:${output.type}`;
            delete output.provider;
          }
        });
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Change node type from aws.RunInstance to aws.CreateInstance
    ["1.0.4", (data) => {
      data.diagram.cells = data.diagram.cells.map(node => {
        if(node.type === "nebulant.rectangle.vertical.aws.RunInstance") {
          node.type = "nebulant.rectangle.vertical.aws.CreateInstance";
        }

        return node;
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Change node provider from "execution-control" to "executionControl"
    ["1.0.5", (data) => {
      data.diagram.cells = data.diagram.cells.map(node => {
        if(node.data?.provider === "execution-control") {
          node.data.provider = "executionControl";
        }

        return node;
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Change node type from aws.DeleteInstance to aws.TerminateInstance
    ["1.0.6", (data) => {
      data.diagram.cells = data.diagram.cells.map(node => {
        if(node.type === "nebulant.rectangle.vertical.aws.DeleteInstance") {
          node.type = "nebulant.rectangle.vertical.aws.TerminateInstance";
        }

        return node;
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Node IDs were simplified. Previously they included the provider in their
    // name, but that was redundant and not desired. Modify the ID in order to
    // remove the provider (eg. s/execution-control-//g)
    ["1.0.7", (data) => {
      data.diagram.cells = data.diagram.cells.map(node => {
        if(node.data?.id?.startsWith("execution-control-")) {
          node.data.id = node.data.id.replace("execution-control-", "");
        }

        if(node.data?.id?.startsWith("generic-")) {
          node.data.id = node.data.id.replace("generic-", "");
        }

        if(node.data?.id?.startsWith("aws-")) {
          node.data.id = node.data.id.replace("aws-", "");
        }

        const renamed = ["condition", "halt", "start"];
        if(renamed.includes(node.data?.id) && node.data?.provider === "generic") {
          node.data.provider = "executionControl";
        }

        return node;
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],
  ]);
}
