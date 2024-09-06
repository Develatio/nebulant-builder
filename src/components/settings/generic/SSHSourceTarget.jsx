import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { TextInput } from "@src/ui/functionality/TextInput";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

export const SSHSourceTarget = (props) => {

  return (
    <Col sm={12}>
      <Row>
        <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
          <TextInput
            node={props.node}
            form={props.form}
            validations={props.validations}
            path={props.src}
            label={"Source"}
            placeholder={"/home/user/file.zip"}
            help_text={"Type a path to a source file or folder."}
            className="mb-0"
          ></TextInput>

          <AnimatedArrow direction="right" className="mx-3 mt-5" />

          <TextInput
            node={props.node}
            form={props.form}
            validations={props.validations}
            path={props.dest}
            label={"Destination"}
            placeholder={"/srv/public/file.zip"}
            help_text={"Type a path to a destination file or folder."}
            className="mb-0"
          ></TextInput>
        </Col>
      </Row>
    </Col>
  )
}
