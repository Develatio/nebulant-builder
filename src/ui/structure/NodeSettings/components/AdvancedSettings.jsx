import { useState } from "react";

import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import FormGroup from "react-bootstrap/esm/FormGroup";

export const AdvancedSettings = (props) => {
  const [visibility, setVisibility] = useState(false);

  return (
    <FormGroup className="form-group" as={Row}>
      <Col className="d-flex justify-content-center">
        <Card border="warning" className={`flex-grow-1 ${!visibility ? "width-fit-content" : ""}`}>
          <Card.Header
            className={`
              d-flex align-items-center justify-content-center
              ${visibility ? "border-warning border-bottom" : "border-bottom-0"}
            `}
          >
            <span className="me-2">This action has <b>advanced settings</b>.</span>
            <Button
              size="sm"
              className="bg-warning rounded px-2 py-1 border-warning pointer"
              onClick={() => setVisibility(!visibility)}
            >
              { visibility ? "Hide" : "Show" }
            </Button>
          </Card.Header>

          {
            visibility && (
              <Card.Body className="px-4 rounded">
                { props.children }
              </Card.Body>
            )
          }
        </Card>
      </Col>
    </FormGroup>
  );
}
