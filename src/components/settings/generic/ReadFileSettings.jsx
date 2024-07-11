import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

export const ReadFileSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Read file</WHeader>

      <WBody>
        <Row className="mt-3">
          <Col sm={12}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              label={"File path"}
              path={"parameters.file_path"}
              placeholder={"Type the path (relative to the CLI or absolute) of the file you wish to read"}
            ></TextInput>
          </Col>

          <Col sm={12}>
            <CheckboxInput
              form={props.form}
              validations={props.validations}
              path={"parameters.interpolate"}
              label={"Interpolate"}
              help_text={"Interpolate the content of the file while reading it"}
            ></CheckboxInput>
          </Col>
        </Row>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Output variable"}
          ></OutputVariable>
        </HasOutput>
      </WBody>

      <WFooter
        close={() => props.callbacks.close()}
        save={(force) => {
          props.callbacks.save(force);
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
