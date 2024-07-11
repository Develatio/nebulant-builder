import { Logger } from "@src/core/Logger";
import { KB_SHORTCUTS } from "@src/core/KeyboardHandler";

export const paper_mouseleave = function(_cellView, _evt) {
  const logger = new Logger();
  logger.debug("Cursor left canvas area, disabling canvas-related shortcuts");
  this.keyboard.set_shortcuts_filter(KB_SHORTCUTS.ALL & ~KB_SHORTCUTS.CANVAS_RELATED);
}
