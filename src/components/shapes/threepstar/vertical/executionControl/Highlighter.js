import { Highlighter as BaseHighlighter } from "@src/components/shapes/highlighter";

export const Highlighter = BaseHighlighter.extend({
  attributes: {
    ...BaseHighlighter.prototype.attributes,
  }
});
