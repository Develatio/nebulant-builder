import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

export const SSHSourceTarget = (props) => {

  return (
    <Col sm={12}>
      <Row>
        <Col sm={12} className="d-flex align-items-start">
          <Row className="w-100">
            <Col sm={4}>
              <SimpleDropdownInput
                form={props.form}
                validations={props.validations}
                path={props.srctype}
                label={"Source type"}
                help_text={"Select the source type."}
                options={[
                  { type: "value", label: "File", value: "file" },
                  { type: "value", label: "Folder", value: "folder" },
                ]}
              ></SimpleDropdownInput>
            </Col>

            <Col sm={4}>
              <CheckboxInput
                form={props.form}
                validations={props.validations}
                path={props.overwrite}
                label={"Overwrite"}
                help_text={"Overwrite destination if exists"}
              ></CheckboxInput>
            </Col>

            <Col sm={4}>
              {
                props.form.get(props.srctype) == "folder" ? (
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={props.recursive}
                    label={"Recursive"}
                    help_text={"Perform a recursive traversal of the source path"}
                  ></CheckboxInput>
                ) : ""
              }
            </Col>
          </Row>
        </Col>

        <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
          <TextInput
            node={props.node}
            form={props.form}
            validations={props.validations}
            path={props.src}
            label={"Source"}
            placeholder={"/home/user/file.zip"}
            help_text={"Type a path to a source file or folder."}
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
          ></TextInput>
        </Col>
      </Row>
    </Col>
  )
}
