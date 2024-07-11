import { object, string } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

//import { DebugSettings } from "@src/components/settings/executionControl/DebugSettings";

import {
  SettingsButton,
} from "@src/components/shapes/rectangle/vertical/executionControl/Tools";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DebugIcon from "@src/assets/img/icons/executionControl/debug.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        //
      }).concat(
        maxRetries
      ),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const DebugStatic = {
  label: "Debug",
  icon: DebugIcon,
  info: "",

  data: {
    id: "debug",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "executionControl",
  },
};

export const DebugFns = {
  init() {
    // We don't want the "SettingsButton" tool in this cell
    this.prop("cellTools", this.prop("cellTools").filter(t => t != SettingsButton), {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = null; //DebugSettings;
  }
};
