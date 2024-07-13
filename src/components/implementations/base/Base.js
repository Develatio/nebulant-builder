import { dia, util } from "@joint/core";
import { FreeTransform } from "@joint/free-transform";
import { Logger } from "@src/core/Logger";
import { GConfig } from "@src/core/GConfig";
import { clone } from "@src/utils/lang/clone";
import {
  SettingsStructureValidator,
} from "@src/components/implementations/base/validators/SettingsStructureValidator";

const DEFAULT_STATE = {
  warnings: {},
  errors: {},
  isValid: true,
};

export class Base extends dia.Element {
  defaults() {
    return util.merge({}, super.defaults, {
      type: "nebulant.components.implementations.base.Base",

      title: "",
      label: "",
      icon: null,
      info: "",

      duplicable: true,
      removable: true,
      resizable: false,
      configurable: true,
      groupable: true,

      data: {
        // The id of the node. This must be unique.
        // id: "example-node",

        // The platform to which the node belongs. This might be a cloud provider
        // ("aws") or some other third party service ("cloudflare").
        // provider: "",
      },

      state: clone(DEFAULT_STATE),
    });
  }

  constructor(attributes = {}, options = {}) {
    super(attributes, options);

    this.logger = new Logger();

    // Set some UI stuff
    this.attr({
      title: { textWrap: { text: this.prop("title") } },
      label: { textWrap: { text: this.prop("label") } },
      image: { xlinkHref: this.prop("icon") },
      info: { textWrap: { text: this.prop("info") } },
    });

    const info = this.prop("data/settings/info");
    if(info) {
      this.setInfo(info);
    }

    if(this.init) {
      this.init();
    }
  }

  hasInfo() {
    return true;
  }

  setInfo(info) {
    this.attr({
      info: { textWrap: { text: info } },
    });
  }

  // Give it the name of the group and it will give you the port of that group
  getPortByGroup(group) {
    return this.getPorts().find(port => port.group == group);
  }

  isGroup() {
    return false;
  }

  toJSON() {
    const res = dia.Element.prototype.toJSON.call(this);

    // Remove fields that should not be serialized
    const saveOnly = [
      // common fields
      "data",
      "id",
      "parent",
      "ports",
      "position",
      "type",
      "z",
    ];
    Object.keys(res).forEach(field => {
      if(!saveOnly.includes(field)) {
        delete res[field];
      }
    });

    // We want to do some extra trimming on the "ports" property
    if(res?.ports?.groups) {
      delete res.ports.groups;
    }

    return res;
  }

  addTools({ elementView, scale }) {
    let cellTools = [];
    const model = elementView.model;
    const engine = elementView.paper;

    if(engine.selection.collection.get(model)) {
      cellTools = cellTools.concat(model.prop("cellTools"));
    }

    // Get the message tools that are already present in the node
    // Honor user settings (show errors? show warnings?)
    const { errors, warnings } = model.prop("state");
    const { show_warnings, show_errors } = engine.gconfig.get("advanced");

    let sw = false;
    if(show_errors && Object.keys(errors).length) {
      sw = true;
      cellTools = cellTools.concat(model.prop("errorsTool"));
    }

    // We want the "!sw" because we don't want to add the errorsTool and the
    // warningsTool on the same node
    if(!sw && show_warnings && Object.keys(warnings).length) {
      cellTools = cellTools.concat(model.prop("warningsTool"));
    }

    if(cellTools.length > 0) {
      const toolsView = new dia.ToolsView({
        tools: cellTools.map(cls => new cls({ scale })),
      });
      elementView.addTools(toolsView);
    }

    // Maybe add FreeTransform (this should happen only when there is only one
    // selected node and that node is resizable)
    if(
      model.prop("resizable") &&
      engine.selection.collection.models.length == 1 &&
      engine.selection.collection.get(model)
    ) {
      new FreeTransform({
        scale,
        cellView: elementView,
        padding: 18,
        usePaperScale: true,
        allowRotation: false,
      }).render();
    }
  }

  migrateData() {
    if(!this.migrator) {
      return {
        data: this.prop("data"),
        success: true,
      };
    }

    const migrated = this.migrator.migrate({
      data: this.prop("data"),
      node_id: this.prop("id"),
    });

    if(migrated.success) {
      this.prop("data", migrated.data, {
        rewrite: true, // don't merge, instead overwrite everything
        skip_undo_stack: true, // we don't want to cause undo/redo noise
      });
    } else {
      // We fucked the user's data... at least generate sane defaults...
      this.enforceSettingsStructure();
    }

    return migrated;
  }

  // This method is used to generate a sane default values and apply them to the
  // node. It's called when:
  //
  // 1) a new node is created
  // 2) we totally fucked up the user's data while applying migrations.
  // 3) migrations were applied successfully and we just want to make sure that
  // the settings structure is valid (this is were we use the
  // "use_existing_settings" opt to skip default settings generation).
  enforceSettingsStructure({ use_existing_settings = false } = {}) {
    this.logger.debug(`Sanitizing data of ${this.prop("data/id")} (${this.prop("id")})...`);

    let sanitizedData = {};
    let ssv;

    // If we're reusing the node's settings, we want to avoid changing the name
    // of the output variable
    if(use_existing_settings) {
      sanitizedData = this.prop("data/settings");
      ssv = new SettingsStructureValidator({ dont_randomize_output_name: true });
    } else {
      if(this.validator) {
        sanitizedData = this.validator.getDefaultValues({}, {
          node_id: this.prop("id"),
        });
      }

      ssv = new SettingsStructureValidator();
    }

    sanitizedData = ssv.getDefaultValues(sanitizedData);

    this.prop("data/settings", sanitizedData, {
      rewrite: true, // don't merge, instead overwrite everything

      // We **DON'T WANT** to skip the undo stack because if we skip it, if/when
      // a node get's removed and re-added, it's data will vanish.
      // Real-world example: drag a Sticky Note to the blueprint. Undo. Redo.
      // The Sticky note won't have any settings if "skip_undo_stack: true",
      // which would lead to a very bad situation.
      skip_undo_stack: false,
    });
  }

  saveSettings(form, isValid) {
    if(!isValid) {
      this.logger.warn("Saving settings with validation errors.");
    }

    // Save values and dispatch update event
    this.prop("data/settings", clone(form.values), {
      rewrite: true,
    });
  }

  resetValidations() {
    this.prop("state", clone(DEFAULT_STATE), {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });
    return this.prop("state");
  }

  async validateSettings({ settings = null, context = {} } = {}) {
    // Some nodes don't have validators
    if(!this.validator) return this.prop("state");

    this.logger.debug(`Validating settings of ${this.prop("data/id")} (${this.prop("id")})...`);

    // We're adding the node_id to the context so that we can perform filtered
    // DQL queries in some of the validators (for example, the uniqueOutputName)
    context.node_id = this.prop("id");

    if(settings == null) {
      settings = this.prop("data/settings");
    }

    const state = await this.validator.validate({ data: settings, context });
    this.prop("state", state, {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });

    if(!state.isValid) {
      const data_id = this.prop("data/id");
      const id = this.prop("id");
      this.logger.error(`Invalid settings found in ${data_id} (${id})!`);

      Object.values(state.warnings).forEach(arr => {
        arr.forEach(warning => this.logger.warn(`${warning.message}`));
      });
      Object.values(state.errors).forEach(arr => {
        arr.forEach(error => this.logger.error(`${error.message}`));
      });
    }

    return state;
  }

  static shadows() {
    // We could have shadows, but that kills the CPU / GPU
    const gconfig = new GConfig();
    return gconfig.get("ui.shadows");
  }
}
