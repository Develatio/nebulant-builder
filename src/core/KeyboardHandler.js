import { Clipboard } from "@joint/clipboard";
import { Keyboard } from "@joint/keyboard";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

export const KB_SHORTCUTS = {
  NONE: 0b00000000,
  CANVAS_RELATED: 0b00000001,
  UI_RELATED: 0b00000010,
  ALL: 0b11111111,
};

export class KeyboardHandler {
  constructor() {
    if(!!KeyboardHandler.instance) {
      return KeyboardHandler.instance;
    }

    this.logger = new Logger();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();

    this.logger.debug("Creating keyboard handler.");

    this.keyboard = new Keyboard({
      filter: (evt, keyboard) => {
        const { target } = evt;

        // If the user is pressing ctrl+f / meta+f inside an input, do nothing
        if (
          target.tagName === "INPUT" &&
          (
            (
              keyboard.isModifierActive("meta", evt) ||
              keyboard.isModifierActive("ctrl", evt)
            ) &&
            String.fromCharCode(evt.which).toUpperCase() == "F"
          )
        ) {
          return true;
      }

      // Otherwise return the default behavior
      return !keyboard.isConsumerElement(evt);
      },
    });
    this.clipboard = new Clipboard({
      useLocalStorage: true,
      deep: true,
      translate: {
        dx: 120,
        dy: 20,
      },
    });

    this.kb_shortcuts_filter = KB_SHORTCUTS.ALL;

    KeyboardHandler.instance = this;

    // Global
    this.keyboard.on("ctrl+f meta+f", (e) => {
      e.preventDefault();
      this.eventBus.publish("FocusSearch");
    });

    this.keyboard.on("keyup:shift", (e) => {
      // We don't want to filter the event here because the user might hit shift
      // while the cursor is hovering the paper, but then release shift when the
      // cursor is not hovering the paper
      const engine = this.runtime.get("objects.engine");
      engine.scroller.setCursor("grab");
    });

    // Canvas-related
    this.keyboard.on("shift", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      const engine = this.runtime.get("objects.engine");
      engine.scroller.setCursor("default");
    });

    this.keyboard.on("ctrl+z meta+z", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("UndoAction");
    });

    this.keyboard.on("ctrl+y meta+y", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("RedoAction");
    });

    this.keyboard.on("ctrl+a meta+a", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("SelectAllElements");
    });

    this.keyboard.on("escape", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("UnselectAllElements");
    });

    this.keyboard.on("ctrl+x meta+x", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("CutSelectedElements");
    });

    this.keyboard.on("ctrl+c meta+c", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("CopySelectedElements");
    });

    this.keyboard.on("ctrl+v meta+v", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("PasteSelectedElements");
    });

    this.keyboard.on("delete backspace", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("DeleteSelectedElements");
    });

    this.keyboard.on("enter", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.CANVAS_RELATED)) return;
      e.preventDefault();

      // Open settings of the currently selected element
      // If none or more tha one element is selected, do nothing
      this.engine = this.runtime.get("objects.engine");
      const { collection } = this.engine.selection;
      if(collection.length == 1) {
        const node = collection.at(0);
        this.runtime.get("objects.blueprintAction").openNodeSettings(node.id);
      }
    });

    // UI-related
    this.keyboard.on("ctrl+e meta+e", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("NewBlueprint");
    });

    this.keyboard.on("ctrl+o meta+o", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("OpenBlueprint");
    });

    this.keyboard.on("ctrl+s meta+s", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("Save");
    });

    this.keyboard.on("ctrl+l meta+l", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("ClearLog");
    });

    this.keyboard.on("ctrl+i meta+i", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("ToggleInfo");
    });

    this.keyboard.on("ctrl+- meta+-", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("ZoomOut");
    });

    this.keyboard.on("ctrl+plus meta+plus", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("ZoomIn");
    });

    // Groups
    this.keyboard.on("ctrl+g meta+g", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("GroupSelectedElements");
    });

    this.keyboard.on("ctrl+b meta+b", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("UngroupSelectedElements");
    });

    // Alignment
    this.keyboard.on("ctrl+up meta+up", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("AlignSelectionTop");
    });

    this.keyboard.on("ctrl+down meta+down", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("AlignSelectionBottom");
    });

    this.keyboard.on("ctrl+left meta+left", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("AlignSelectionLeft");
    });

    this.keyboard.on("ctrl+right meta+right", (e) => {
      if(!(this.kb_shortcuts_filter & KB_SHORTCUTS.UI_RELATED)) return;
      e.preventDefault();
      this.eventBus.publish("AlignSelectionRight");
    });

    return this;
  }

  enable() {
    this.logger.debug("Enabling keyboard handler...");
    this.keyboard.enable();
  }

  disable() {
    this.logger.debug("Disabling keyboard handler...");
    this.keyboard.disable();
  }

  // Implemented by using bitwise logic (Example: https://stackoverflow.com/a/2936506)
  // Call this method by passing it a KB_SHORTCUTS constant or a bitwise product.
  // Examples:
  //   * ALL <-- report all
  //   * CANVAS_RELATED | UI_RELATED <-- report CANVAS_RELATED and UI_RELATED
  //   * ALL & ~CANVAS_RELATED <-- report ALL except CANVAS_RELATED
  set_shortcuts_filter(filter) {
    this.logger.debug("Setting keyboard events filter to", filter.toString(2));
    this.kb_shortcuts_filter = filter;
  }
}
