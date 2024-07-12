import { array, object, string, boolean, number } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { allowOnlyBasicChars } from "@src/components/implementations/base/validators/fields/allowOnlyBasicChars";
import { disallowReservedNames } from "@src/components/implementations/base/validators/fields/disallowReservedNames";

import { StartSettings } from "@src/components/settings/executionControl/StartSettings";
import {
  RemoveButton,
} from "@src/components/shapes/rectangle/vertical/executionControl/Tools";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import { hexToHSL } from "@src/utils/colors";
import { HEX_COLOR } from "@src/utils/constants";

import StartIcon from "@src/assets/img/icons/executionControl/start.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default("This is the start node!"),
      parameters: object({
        group_settings_enabled: boolean().label("Belongs to a group").default(false),
        name: string().label("Name").max(100).default("New group"),
        version: string().label("Version").max(30).default("draft"),
        text_color: string().matches(HEX_COLOR, "A valid hex color is required (alpha channel is not supported)").label("Text color").max(7).default("#ffffff"),
        color: string().matches(HEX_COLOR, "A valid hex color is required (alpha channel is not supported)").label("Background color").max(7).default("#7986cb"),
        description: string().label("Description").max(10000).default(""),
        image: string().label("Image").default(""),
        // keywords: [] // for better search matching

        input_parameters: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            name: string().test(
              allowOnlyBasicChars
            ).test(
              disallowReservedNames
            ).default("").min(1).label("Variable name"),
            required: boolean().default(false),
            ask_at_runtime: boolean().default(false),
            stack: boolean().default(false),

            // The type of the variable
            type: string().oneOf([
              "boolean",
              "text",
              "textarea",
              "selectable-dql-var-type",
              "selectable-dql-var-capability",
              "selectable-static",
            ]).default("text"),

            // When type is boolean
            bool_value: boolean().default(false).label("Value"),

            // When type is text or textarea
            value: string().default("").label("Value").when(["required", "ask_at_runtime"], ([required, ask_at_runtime], schema) => {
              if(required && !ask_at_runtime) {
                schema = schema.required();
              }
              return schema;
            }),

            // When type is selectable-vars-type
            vartypes: array().of(string()).default([]).label("Variable types"),

            // When type is selectable-vars-capability
            varcapabilities: array().of(string()).default([]).label("Capabilities"),

            // When type is selectable-static
            options: array().default([]).label("Options").when(["required", "ask_at_runtime", "type"], ([required, ask_at_runtime, type], schema) => {
              if(required && !ask_at_runtime && type === "selectable-static") {
                schema = schema.required().min(1);
              }
              return schema;
            }),
          }),
        })).default([]),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // adds "name" field if it doesn't exist
    ["1.0.1", (data) => {
      if(!data.settings) data.settings = {};
      if(!data.settings.parameters) data.settings.parameters = {};
      if(!data.settings.parameters.name) data.settings.parameters.name = "Group";

      return {
        data,
        success: true,
      };
    }],

    // adds "version", "description" and "color" fields
    ["1.0.2", (data) => {
      if(!data.settings.parameters.version) data.settings.parameters.version = "1.0.0";
      if(!data.settings.parameters.color) data.settings.parameters.color = "#7B64FF";
      if(!data.settings.parameters.description) data.settings.parameters.description = "";

      return {
        data,
        success: true,
      };
    }],

    // add "group_settings_enabled" field
    ["1.0.3", (data) => {
      data.settings.parameters.group_settings_enabled = false;

      return {
        data,
        success: true,
      }
    }],

    // add "text_color" field
    ["1.0.4", (data) => {
      data.settings.parameters.text_color = "#000000";

      return {
        data,
        success: true,
      }
    }],

    // add "input_parameters" field
    ["1.0.5", (data) => {
      data.settings.parameters.input_parameters = [];

      return {
        data,
        success: true,
      }
    }],

    // add "image" field
    ["1.0.6", (data) => {
      data.settings.parameters.image = "";

      return {
        data,
        success: true,
      }
    }],

    // Migrate to new data format
    ["1.0.7", (data) => {
      const objs = data.settings.parameters.input_parameters;

      data.settings.parameters.input_parameters = objs.map(obj => ({
        name: "new-input-variable",
        value: obj,
      }));

      return {
        data,
        success: true,
      }
    }],

    // Migrate to new data format
    ["1.0.8", (data) => {
      const objs = data.settings.parameters.input_parameters;

      data.settings.parameters.input_parameters = objs.map(param => {
        param.stack = false;

        return param;
      });

      return {
        data,
        success: true,
      }
    }],

    // Migrate to new data format
    ["1.0.9", (data) => {
      delete data.settings.parameters.version;

      return {
        data,
        success: true,
      }
    }],

    // Migrate to new data format
    ["1.0.10", (data) => {
      data.settings.parameters.version = "";

      return {
        data,
        success: true,
      }
    }],
  ]);
}

export const StartStatic = {
  label: "Start",
  icon: StartIcon,
  info: "This is the start node!",

  duplicable: false,
  removable: false,
  groupable: false,

  data: {
    id: "start",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "executionControl",
  },
};

export const StartFns = {
  init() {
    // We don't want the "RemoveButton" tool in this cell
    this.prop("cellTools", this.prop("cellTools").filter(t => t != RemoveButton), {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = StartSettings;

    const label = this.prop("data/settings/parameters/name");
    this.renameParent(label);

    const img = this.prop("data/settings/parameters/image");
    this.setParentImage(img);

    let color = this.prop("data/settings/parameters/color");
    this.colorizeParent(hexToHSL(color));

    color = this.prop("data/settings/parameters/text_color");
    this.colorizeTextParent(hexToHSL(color));
  },

  renameParent(text) {
    if(!this.parent()) return;

    const parent = this.getParentCell();
    if(parent) {
      parent.rename(text);
    } else if(this.parent()) {
      setTimeout(() => {
        this.renameParent(text);
      }, 50);
    }
  },

  setParentImage(img) {
    if(!this.parent()) return;

    const parent = this.getParentCell();
    if(parent) {
      parent.setImage(img);
    } else if(this.parent()) {
      setTimeout(() => {
        this.setParentImage(img);
      }, 50);
    }
  },

  colorizeParent(hsl) {
    if(!this.parent()) return;

    const parent = this.getParentCell();
    if(parent) {
      parent.colorize(hsl);
    } else if(this.parent()) {
      setTimeout(() => {
        this.colorizeParent(hsl);
      }, 50);
    }
  },

  colorizeTextParent(hsl) {
    if(!this.parent()) return;

    const parent = this.getParentCell();
    if(parent) {
      parent.colorizeText(hsl);
    } else if(this.parent()) {
      setTimeout(() => {
        this.colorizeTextParent(hsl);
      }, 50);
    }
  }
};
