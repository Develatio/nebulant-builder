import { util } from "@joint/core";
import { useEffect, useState } from "react";
import { useForm } from "react-form-state-manager";
import { ErrorBoundary } from "react-error-boundary";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { clone } from "@src/utils/lang/clone";
import { DiagramQL } from "@src/data/DiagramQL";
import { WModal } from "@src/ui/structure/WModal/WModal";
import { RenameVariables } from "@src/ui/structure/Messages/RenameVariables";

import { Icon } from "@src/ui/functionality/Icon";
import { Tooltip } from "@src/ui/functionality/Tooltip";

import QuestionIcon from "@src/assets/img/icons/control/question.svg?transform";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
};

const validateForm = util.debounce(({ node, data, form, submitted, validations, setValidations }) => {
  if(!node) return;

  node.validateSettings({
    settings: data,
    context: { form },
  }).then((validation) => {
    const newValidations = {
      submitted,
      ...validation,
    };

    if(!util.isEqual(validations, newValidations)) {
      setValidations(newValidations);
    }

    // Changing one field might cause validation warnings / errors in other
    // fields. Warnings / errors won't show automatically on fields, unless
    // they are marked as "touched". This is why we must trigger them manually.
    //
    // TODO: Maybe make sure that at least one field has been marked as "touched"?
    //                     vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    if(!validation.isValid /*&& Object.keys(form.touched).length > 0*/) {
      const state = node.prop("state");
      Object.keys(state.warnings).forEach(warning => form.setTouched(warning, true));
      Object.keys(state.errors).forEach(error => form.setTouched(error, true));
    }
  });
}, 450, {
  leading: true,
  trailing: true,
});

export const NodeSettings = () => {
  const [visible, setVisibility] = useState(false);
  const [node, setNode] = useState(null);

  const form = useForm({ values: {} });
  const [validations, setValidations] = useState(VALIDATION_BODY);
  const [submitted, setSubmitted] = useState(false);

  const logger = new Logger();
  const eventBus = new EventBus();

  validateForm({ node, data: form.values, form, submitted, validations, setValidations });

  useEffect(() => {
    const open = (_msg, data) => {
      const runtime = new Runtime();
      const model = runtime.get("objects.main_model");
      const node = model.getCell(data.node_id);

      // The node might have been marked as faulty (pulse highlight). Unmark it
      // just in case.
      const engine = runtime.get("objects.engine");
      engine.unMarkOneAsFaulty(node);

      if(!node.prop("configurable")) return;

      if(node.isGroup()) {
        data = node.getStartNode().prop("data/settings");
      } else {
        data = node.prop("data/settings");
      }

      form.setInitialValues(clone(data));
      form.setParsedValues(clone(data));

      // If there are any errors or warnings, we set the "touched" state of the
      // erroneous fields to "true". This triggers visual alerts to show up.
      //
      // We're doing this because if there are any validation errors / warnings
      // and the user just opened the settings modal, we asume that the user wants
      // to see and possibly fix the validation errors / warnings.
      const state = node.prop("state");
      Object.keys(state.warnings).forEach(warning => form.setTouched(warning, true));
      Object.keys(state.errors).forEach(error => form.setTouched(error, true));

      setNode(node);

      setVisibility(true);
    }

    eventBus.subscribe("OpenNodeSettings", open);

    return () => {
      eventBus.unsubscribe("OpenNodeSettings", open);
    };
  }, []);

  const close = async () => {
    const runtime = new Runtime();
    const model = runtime.get("objects.main_model");

    // Check if this node is actually connected in any way to the main "Start"
    // node. If so, trigger a validation, otherwise just reset the validation.
    const connectedNodes = model.getConnectedElements();
    const connectedIds = Array.from(connectedNodes).map(n => n.id);
    if(connectedIds.includes(node.id)) {
      // Trigger a validation in order to discard any validation errors that
      // might have been attached to the node due to changes made to the
      // settings, but discarted because the NodeSettings modal was closed.
      await node.validateSettings();
    } else {
      node.resetValidations();
    }

    setNode(null);
    setSubmitted(false);

    form.setInitialValues({});
    form.setParsedValues({});

    setVisibility(false);
  }

  const save = async (force = false, propagateVariablesNameChanges = true) => {
    setSubmitted(true);
    const validated = await node.validateSettings({
      settings: form.values,
      context: { form },
    });

    if(!validated.isValid && !force) {
      logger.warn("Refusing to save settings because of validation errors.");
      return;
    }

    // Init batch undo stack
    const runtime = new Runtime();
    const commandManager = runtime.get("objects.commandManager");
    commandManager.initBatchCommand();

    // If the settings contain an "outputs" object it means that the node has
    // "output" variables. If that is the case, we must check if any of these
    // changed

    // If the form doesn't have "outputs" or the "propagateVariablesNameChanges"
    // flag has been set to "false", save the form and quit.
    if(!form.values.outputs || !propagateVariablesNameChanges) {
      node.saveSettings(form, validated.isValid);

      // Finish batch undo stack
      commandManager.storeBatchCommand();
      close();

      return;
    }

    // This won't work for the "Start" node (the input variables for a group).
    // And it can't be fixed in any way, since variables can be removed and
    // re-added with a different position; there is no technically viable way
    // of telling which variable was renamed and which was moved from one
    // position to another, hence we can't really created a set of operations to
    // fix the orphaned variables.
    const model = runtime.get("objects.main_model");
    const dql = new DiagramQL(model)

    // Check if any of the output variables changed (or got deleted)
    let outputs = Object.entries(
      form.initialValues.outputs
    ).map(([oname, ovalue]) => ({
      old: ovalue.value,
      new: form.values.outputs[oname]?.value,
    })).filter(
      obj => obj.old != obj.new
    );

    // ...for each variable that changed, check if any nodes are using the
    // "old" value of that variable
    outputs = outputs.map(output => {
      const dependant_node_ids = dql.query(
        dql.nodesUsing({
          parent: node.id,
          varname: output.old,
        })
      )?.map(
        obj => obj.__node_id
      ) || [];

      return {
        ...output,
        dependant_node_ids,
      };
    }).filter(
      output => output.dependant_node_ids?.length > 0
    );

    // If there are none, save the settings and quit...
    if(outputs.length == 0) {
      node.saveSettings(form, validated.isValid);

      // Finish batch undo stack
      commandManager.storeBatchCommand();
      close();
      return;
    }

    // ...but there are any, ask the user if we should update the references
    setVisibility(false);

    const eventBus = new EventBus();
    eventBus.publish("OpenDialog", {
      title: "Update variable references?",
      body: <RenameVariables outputs={outputs} />,
      cancel: () => setVisibility(true),
      close: () => setVisibility(true),
      no: () => {
        node.saveSettings(form, validated.isValid);
        // Finish batch undo stack
        commandManager.storeBatchCommand();
        close();
      },
      yes: () => {
        // Update references
        outputs.forEach(output => {
          dql.query(
            dql.bulkUpdateReference({
              node_ids: output.dependant_node_ids,
              old_varname: output.old,
              new_varname: output.new,
            })
          );
        });

        node.saveSettings(form, validated.isValid);
        // Finish batch undo stack
        commandManager.storeBatchCommand();
        close();
      },
    });
  }

  if(!visible) return "";
  if(!node || !node.settingsTemplate) return "";

  const SettingsTemplate = node.settingsTemplate;

  const { provider, id } = node.prop("data");
  const base = `${process.env.DOCS_ENDPOINT}/builder/providers`;

  const help = (
    <Tooltip
      placement="left"
      label={<>Go to the documentation for this action</>}
    >
      <Icon className="question h-auto w-auto me-3">
        <a
          target="_blank"
          rel="noreferrer"
          href={`${base}/${provider}/${id}`}
        >
          <QuestionIcon />
        </a>
      </Icon>
    </Tooltip>
  )

  return (
    <WModal
      visible={visible}
      close={close}
      className="node-settings"
      // We don't want the user to be able to (accidentally) close the window if
      // there are unsaved changes. Only the "close" button should be able to
      // discard unsaved changes. This is pure UX :)
      keyboard={!form.changed()}
    >
      <ErrorBoundary fallback={<></>} onError={(error, info) => {
        close();
        logger.error("Error while rendering setting");
        logger.error(error.message);
        logger.error(info.componentStack);
        eventBus.publish("crash");
      }}>
        <SettingsTemplate
          help={help}

          node={node}

          form={form}
          validations={validations}

          callbacks={{
            save,
            close,
          }}
        />
      </ErrorBoundary>
    </WModal>
  );
}
