import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { Runtime } from "@src/core/Runtime";
import { hexToHSL } from "@src/utils/colors";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";
import { ColorPicker } from "@src/ui/functionality/ColorPicker";

export const StickyNoteSettings = (props) => {
  const { node } = props;

  return (
    <Container>
      <WHeader help={props.help}>Sticky note settings</WHeader>

      <WBody>
        <Row>
          <Col sm={9}>
            <TextInput
              node={node}
              form={props.form}
              validations={props.validations}
              as={"textarea"}
              rows={5}
              path={"parameters.content"}
              label={"Content"}
              placeholder={"Write here..."}
            ></TextInput>
          </Col>

          <Col sm={3}>
            <Row>
              <Col sm={12}>
                <ColorPicker
                  node={node}
                  form={props.form}
                  validations={props.validations}
                  label={"Text color"}
                  path={"parameters.text_color"}
                  placeholder={""}
                ></ColorPicker>
              </Col>

              <Col sm={12}>
                <ColorPicker
                  node={node}
                  form={props.form}
                  validations={props.validations}
                  label={"Background Color"}
                  path={"parameters.color"}
                  placeholder={""}
                ></ColorPicker>
              </Col>
            </Row>
          </Col>
        </Row>
      </WBody>

      <WFooter
        close={() => props.callbacks.close()}
        save={async (force) => {
          const runtime = new Runtime();

          const cm = runtime.get("objects.commandManager");
          cm.initBatchCommand();

          await props.callbacks.save(force);

          node.rename(node.prop("data/settings/parameters/content"));

          let color = node.prop("data/settings/parameters/color");
          node.colorize(hexToHSL(color));

          color = node.prop("data/settings/parameters/text_color");
          node.colorizeText(hexToHSL(color));

          cm.storeBatchCommand();
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
