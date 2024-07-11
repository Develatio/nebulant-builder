import { useState } from "react";
import { useForm } from "react-form-state-manager";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";

import { MultiTextEmpty } from "./SuperTextTab/MultiTextEmpty";
import { MultiTextSelected } from "./SuperTextTab/MultiTextSelected";

export const SuperTextTab = () => {
  const form = useForm({ values: { "disabled": false } });
  const [validations] = useState({ warnings: {}, errors: {}, isValid: true });

  return (
    <>
      <Row className="my-5">
        <CheckboxInput
          form={form}
          validations={validations}
          path={"disabled"}
          label={"Disabled mode"}
        />
      </Row>

      {/*--------------------------------------------------------------------*/}

      <Row className="my-5">
        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multi text (empty)</span>
            <MultiTextEmpty disabled={form.get("disabled")} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multi text (empty)</span>
            <MultiTextSelected disabled={form.get("disabled")} />
          </div>
        </Col>
      </Row>

    </>
  );
}
