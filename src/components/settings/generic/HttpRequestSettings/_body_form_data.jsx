import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";

import { TextInput } from "@src/ui/functionality/TextInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";

export const body_form_data = (props) => {
  const chunks = props.form.get("parameters.body_form_data");

  return (
    <>
      {
        chunks.length > 0 && (
          <Row className="p-4 pb-2 pt-0">
            {
              chunks.map((_parameter, idx) => {
                return (
                  <Col sm={12} key={idx}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <SimpleDropdownInput
                          form={props.form}
                          validations={props.validations}
                          path={`parameters.body_form_data[${idx}].type`}
                          label={""}
                          help_text={"Field type"}
                          options={[
                            { type: "value", label: "Text", value: "text" },
                            { type: "value", label: "File", value: "file" },
                          ]}
                        ></SimpleDropdownInput>
                      </div>

                      <div className="flex-grow-1 me-3">
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={`parameters.body_form_data[${idx}].name`}
                          label={""}
                          placeholder={""}
                          help_text={"Field name"}
                        ></TextInput>
                      </div>

                      <div className="flex-grow-1 me-3">
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={`parameters.body_form_data[${idx}].value`}
                          label={""}
                          placeholder={""}
                          help_text={"Field value"}
                        ></TextInput>
                      </div>

                      {
                        props.form.get(`parameters.body_form_data[${idx}].type`) == "text" ? (
                          <div className="flex-grow-1">
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`parameters.body_form_data[${idx}].content_type`}
                              label={""}
                              placeholder={"text/plain"}
                              help_text={"Content type"}
                            ></TextInput>
                          </div>
                        ) : ""
                      }

                      <div className="d-flex justify-content-center align-items-start mb-5 ms-2">
                        <button
                          type="button"
                          className="btn-close scale-08 me-2"
                          onClick={() => props.form.delete("parameters.body_form_data", idx)}
                        ></button>
                      </div>
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        )
      }

      <Row className="rounded-bottom mx-n1-extra mb-n1-extra">
        <Col sm={12} className="text-center">
          <Button
            variant="outline-primary d-block w-100"
            onClick={() => props.form.append("parameters.body_form_data", {
              name: "",
              value: "",
              type: "text",
              content_type: "",
            })}
          >
            Add element
          </Button>
        </Col>
      </Row>
    </>
  );
}
