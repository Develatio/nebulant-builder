import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";

export const LogSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Log settings</WHeader>

      <WBody>
        <Row className="mt-3">
          <Col sm={12}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              label={"Content"}
              path={"parameters.content"}
              as={"textarea"}
              rows={6}
              placeholder={"Type the content you wish the CLI to print to STDOUT when this point is reached during the execution of the blueprint. Example: 'Hi {{ name }}!'"}
            ></TextInput>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col sm={12}>
            <Alert variant="info" className="py-1 small mb-2">
              <div className="mb-3">
                <b>Tips</b>
              </div>

              <ul>
                <li>
                  Use <code>{"{{"} VARIABLE.__json {"}}"}</code> to view the underlying data structure that a variable might hold
                </li>

                <li>
                  Use <code>{"{{"} VARIABLE.__hasError {"}}"}</code> and <code>{"{{"} VARIABLE.__error {"}}"}</code> to check if an operation had an error, and if so, what was the error.
                </li>
              </ul>
            </Alert>
          </Col>
        </Row>
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
