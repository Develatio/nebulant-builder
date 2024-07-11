import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";

import { TextInput } from "@src/ui/functionality/TextInput";

export const body_form_urlencoded = (props) => {
  const chunks = props.form.get("parameters.body_x_www_form_urlencoded");

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
                      <div className="flex-grow-1 me-3">
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={`parameters.body_x_www_form_urlencoded[${idx}].name`}
                          label={""}
                          placeholder={""}
                          help_text={"Field name"}
                        ></TextInput>
                      </div>

                      <div className="flex-grow-1">
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={`parameters.body_x_www_form_urlencoded[${idx}].value`}
                          label={""}
                          placeholder={""}
                          help_text={"Field value"}
                        ></TextInput>
                      </div>

                      <div className="d-flex justify-content-center align-items-start mb-5 ms-2">
                        <button
                          type="button"
                          className="btn-close scale-08 me-2"
                          onClick={() => props.form.delete("parameters.body_x_www_form_urlencoded", idx)}
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
            onClick={() => props.form.append("parameters.body_x_www_form_urlencoded", {
              name: "",
              value: "",
            })}
          >
            Add element
          </Button>
        </Col>
      </Row>
    </>
  );
}
