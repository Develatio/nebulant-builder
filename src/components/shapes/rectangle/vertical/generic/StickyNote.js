import { util } from "@joint/core";

import { Rect } from "./Rect";

import { extendFns } from "@src/utils/lang/extendFns";

import { StickyNoteStatic, StickyNoteFns } from "@src/components/implementations/generic/StickyNote";

export class StickyNote extends Rect {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.StickyNote",
      ...StickyNoteStatic,
    });
  }
}
extendFns(StickyNote, StickyNoteFns);
