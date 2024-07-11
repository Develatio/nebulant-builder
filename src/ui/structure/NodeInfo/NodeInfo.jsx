import { useEffect, useState } from "react";
import { useForm } from "react-form-state-manager";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import { clone } from "@src/utils/lang/clone";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WModal } from "@src/ui/structure/WModal/WModal";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
  submitted: false,
};

export const NodeInfo = () => {
  const [visible, setVisibility] = useState(false);
  const [node, setNode] = useState(null);

  const eventBus = new EventBus();
  const form = useForm({ values: {} });

  useEffect(() => {
    const open = (_msg, data) => {
      const runtime = new Runtime();
      const model = runtime.get("objects.main_model");
      const node = model.getCell(data.node_id);

      // The node might have been marked as faulty (pulse highlight). Unmark it
      // just in case.
      const engine = runtime.get("objects.engine");
      engine.unMarkOneAsFaulty(node);

      if(node.isGroup()) return;

      data = node.prop("data/settings");

      form.setInitialValues(clone(data));
      form.setParsedValues(clone(data));

      setNode(node);
      setVisibility(true);
    }

    eventBus.subscribe("OpenNodeInfo", open);

    return () => {
      eventBus.unsubscribe("OpenNodeInfo", open);
    };
  }, []);

  const close = () => {
    setNode(null);

    form.setInitialValues({});
    form.setParsedValues({});

    setVisibility(false);
  }

  if(!visible || !node) return "";

  return (
    <WModal
      visible={visible}
      close={close}
      className="node-info"
      keyboard={true}
    >

      <Container>
        <WHeader>Node information</WHeader>

        <WBody>
          <Row>
            <Col sm={12}>
              <TextInput
                node={node}
                form={form}
                validations={VALIDATION_BODY}
                as={"textarea"}
                rows={5}
                path={"info"}
                label={"Information about this node"}
                placeholder={"Write here a brief description about the purpose of this node..."}
              ></TextInput>
            </Col>
          </Row>
        </WBody>

        <WFooter
          close={close}
          save={() => {
            node.saveSettings(form, true);
            const info = node.prop("data/settings/info");
            node.setInfo(info);
            close();
          }}
          validations={VALIDATION_BODY}
        ></WFooter>
      </Container>
    </WModal>
  );
}
