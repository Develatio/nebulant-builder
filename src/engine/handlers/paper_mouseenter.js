import { Logger } from "@src/core/Logger";
import { KB_SHORTCUTS } from "@src/core/KeyboardHandler";

export const paper_mouseenter = function(_cellView, _evt) {
  const logger = new Logger();
  logger.debug("Cursor entered canvas area, enabling canvas-related shortcuts");
  this.keyboard.set_shortcuts_filter(KB_SHORTCUTS.ALL);
}
