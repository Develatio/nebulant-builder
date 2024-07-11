import EndIcon from "@src/assets/img/icons/executionControl/end.svg";

export const EndStatic = {
  label: "End",
  icon: EndIcon,

  duplicable: false,
  removable: false,
  configurable: false,
  groupable: false,

  data: {
    id: "end",
    version: "1.0.0",
    provider: "executionControl",
  },
};

export const EndFns = {
  init() {
    // We don't want tools in this cell
    this.prop("cellTools", [], {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });
  }
};

