import { Runtime } from "@src/core/Runtime";

const getSelection = () => {
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");

  const elements = engine.selection.collection.toArray();
  return engine.model.getCellsBBox(elements);
}

const align = (coordinate, value) => {
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");
  const elements = engine.selection.collection.toArray();

  engine.model.startBatch("alignment");
  elements.forEach((el) => {
    const { width, height } = el.size();
    const v = value(coordinate === "x" ? width : height);
    el.prop(["position", coordinate], v);
  });
  engine.model.stopBatch("alignment");
}

export const alignLeft = () => {
  const selection = getSelection();
  if(!selection) return;

  const { x } = selection;
  align("x", () => x);
}

export const alignRight = () => {
  const selection = getSelection();
  if(!selection) return;

  const { x, width } = selection;
  align("x", (elWidth) => x + width - elWidth);
}

export const alignTop = () => {
  const selection = getSelection();
  if(!selection) return;

  const { y } = selection;
  align("y", () => y);
}

export const alignBottom = () => {
  const selection = getSelection();
  if(!selection) return;

  const { y, height } = selection;
  align("y", (elHeight) => y + height - elHeight);
}

export const alignVCenter = () => {
  const selection = getSelection();
  if(!selection) return;

  const { x, width } = selection;
  align("x", (elWidth) => x + (width - elWidth) / 2);
}

export const alignHCenter = () => {
  const selection = getSelection();
  if(!selection) return;

  const { y, height } = selection;
  align("y", (elHeight) => y + (height - elHeight) / 2);
}
