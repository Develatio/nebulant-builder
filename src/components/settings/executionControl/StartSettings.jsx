import Container from "react-bootstrap/esm/Container";

import { Runtime } from "@src/core/Runtime";
import { Layout } from "@src/engine/Layout";
import { hexToHSL } from "@src/utils/colors";

import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { SettingsStructureValidator } from "@src/components/implementations/base/validators/SettingsStructureValidator";

import { GroupSettings } from "./StartSettings/_GroupSettings";

export const StartSettings = (props) => {
  const { node, form } = props;
  const runtime = new Runtime();

  const ssv = new SettingsStructureValidator({
    dont_randomize_output_name: true,
  });

  const input_parameters = form.get("parameters.input_parameters");

  if(!form.getInitialValue("outputs")) {
    let outputs = {};
    input_parameters.forEach(({ _name, value }) => {
      outputs[value.name] = {
        value: value.name,
        type: "generic:user_variable",
      }
    });

    // Pass data to base validator
    ({ outputs } = ssv.getDefaultValues({ outputs }));

    // By using a setTimeout we avoid updating the form, which belongs to the
    // parent component, while we're rendering this component. If we don't do
    // this, we'll end up in an infinite loop caused by setState calling itself.
    setTimeout(() => {
      form.setInitialValue("outputs", outputs);
    });
  }

  return (
    <Container className="start-settings">
      <WHeader help={props.help}>
        { node.getParentCell() ? "Group settings" : "Start settings" }
      </WHeader>

      <GroupSettings node={node} form={form} validations={props.validations} />

      <WFooter
        close={() => props.callbacks.close()}
        save={async (force) => {
          const old_group_settings_enabled = node.prop("data/settings/parameters/group_settings_enabled");

          let outputs = {};

          input_parameters.forEach(({ _name, value }) => {
            if(["boolean", "text", "textarea", "selectable-static"].includes(value.type)) {
              outputs[value.name] = {
                value: value.name,
                type: "generic:user_variable",
              };
            } else if(["selectable-dql-var-type", "selectable-dql-var-capability"].includes(value.type)) {
              outputs[value.name] = {
                value: value.name,
                type: "generic:unknown", // ¿?
              };
            }
          });

          // Pass data to base validator
          ({ outputs } = ssv.getDefaultValues({ outputs }));

          form.set("outputs", outputs);

          // TODO: If we have a parent, update the layer name

          await props.callbacks.save(force, false);

          const commandManager = runtime.get("objects.commandManager");

          let undoStackSize = commandManager.undoStack.length;
          node.renameParent(node.prop("data/settings/parameters/name"));
          if(undoStackSize != commandManager.undoStack.length) {
            commandManager.squashUndo(2);
          }

          undoStackSize = commandManager.undoStack.length;
          node.setParentImage(node.prop("data/settings/parameters/image"));
          if(undoStackSize != commandManager.undoStack.length) {
            commandManager.squashUndo(2);
          }

          undoStackSize = commandManager.undoStack.length;
          let color = node.prop("data/settings/parameters/color");
          node.colorizeParent(hexToHSL(color));
          if(undoStackSize != commandManager.undoStack.length) {
            commandManager.squashUndo(2);
          }

          undoStackSize = commandManager.undoStack.length;
          color = node.prop("data/settings/parameters/text_color");
          node.colorizeTextParent(hexToHSL(color));
          if(undoStackSize != commandManager.undoStack.length) {
            commandManager.squashUndo(2);
          }

          // If this is the main "Start" node check if we should add an "End"
          // node.
          if(node.id == node.graph.getStartNode().id) {
            const group_settings_enabled = node.prop("data/settings/parameters/group_settings_enabled");
            // If old_group_settings_enabled was disabled and now it's enabled
            // we should add the "End" node.
            // If old_group_settings_enabled was enabled and now it's disabled
            // we should remove the "End" node.
            if(!old_group_settings_enabled && group_settings_enabled) {
              const shapes = runtime.get("objects.shapes");
              const end = new shapes.nebulant.rectangle.vertical.executionControl.End();
              // Add default settings

              end.enforceSettingsStructure();
              end.addTo(node.graph);

              const layout = new Layout(node);
              const delta = layout.generateDeltaFromGridDisplacement([0, 1]);
              layout.moveNodeToGridSegment([0, 0], end);
              layout.avoidIntersections(delta, [end], node.getParentCell());
            } else if(old_group_settings_enabled && !group_settings_enabled) {
              const end = node.graph.getEndNode();
              end.remove();
            }
          }
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
