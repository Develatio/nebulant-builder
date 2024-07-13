import { dia } from "@joint/core";
import { object, string } from "yup";

import { Highlighter as BaseHighlighter } from "@src/components/shapes/highlighter";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { StickyNoteSettings } from "@src/components/settings/generic/StickyNoteSettings";

import {
  SettingsButton,
} from "@src/components/shapes/rectangle/vertical/generic/Tools";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import { hexToHSL } from "@src/utils/colors";
import { HEX_COLOR } from "@src/utils/constants";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      parameters: object({
        content: string().default("Sticky note").label("Content"),
        text_color: string().matches(HEX_COLOR, "A valid hex color is required (alpha channel is not supported)").label("Text color").max(7).default("#d9d9d9"),
        color: string().matches(HEX_COLOR, "A valid hex color is required (alpha channel is not supported)").label("Text color").max(7).default("#8bc34a"),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

const Highlighter = BaseHighlighter.extend({
  attributes: {
    ...BaseHighlighter.prototype.attributes,
  }
}, {
  highlight(view, persistent = false) {
    Object.defineProperty(Highlighter.prototype, "attributes", {
      get: function() {
        const model = view.model;
        const color = model.prop("data/settings/parameters/color");
        const { h, s, l } = hexToHSL(color);
        const opacity = persistent ? 1 : 0.4;

        return {
          ...BaseHighlighter.prototype.attributes,
          stroke: `hsl(${h}, ${s}%, ${l}%, ${opacity})`,
        };
      }
    });

    BaseHighlighter.highlight.call(this, view, persistent);
  }
});

export const StickyNoteStatic = {
  label: "Sticky note",
  highlighter: Highlighter,
  resizable: true,
  color: "#8bc34a",
  text_color: "#d9d9d9",

  data: {
    id: "sticky-note",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const StickyNoteFns = {
  init() {
    // We don't want the "SettingsButton" tool in this cell
    this.prop("cellTools", this.prop("cellTools").filter(t => t != SettingsButton), {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = StickyNoteSettings;

    const content = this.prop("data/settings/parameters/content");
    this.rename(content || this.prop("label"));

    const color = this.prop("data/settings/parameters/color");
    this.colorize(hexToHSL(color || this.prop("color")));

    const text_color = this.prop("data/settings/parameters/text_color");
    this.colorizeText(hexToHSL(text_color || this.prop("text_color")));
  },

  hasInfo() {
    return false;
  },

  rename(text) {
    this.attr({
      label: { textWrap: { text } },
    });
  },

  colorize({ h, s, l }) {
    const bgColor = `hsl(${h}, ${s}%, ${l}%, 0.5)`;
    const borderColor = `hsl(${h}, ${s}%, ${l}%, 1)`;

    this.attr({
      pathBody: { fill: bgColor, stroke: borderColor },
    });
  },

  colorizeText({ h, s, l }) {
    const color = `hsl(${h}, ${s}%, ${l}%, 1)`;

    this.attr({
      label: { fill: color },
    });
  },

  toJSON() {
    const res = dia.Element.prototype.toJSON.call(this);

    // Remove fields that should not be serialized
    const saveOnly = [
      // sticky note fields
      //"angle",
      "size",
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
};
