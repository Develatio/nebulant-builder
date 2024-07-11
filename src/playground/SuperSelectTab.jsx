import { useState } from "react";
import { useForm } from "react-form-state-manager";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";

import { SingleSelectNonEditableEmpty } from "./SuperSelectTab/SingleSelectNonEditableEmpty";
import { SingleSelectEditableEmpty } from "./SuperSelectTab/SingleSelectEditableEmpty";
import { SingleSelectNonEditableSelected } from "./SuperSelectTab/SingleSelectNonEditableSelected";
import { SingleSelectEditableSelected } from "./SuperSelectTab/SingleSelectEditableSelected";

import { MultiSelectNonEditableEmpty } from "./SuperSelectTab/MultiSelectNonEditableEmpty";
import { MultiSelectEditableEmpty } from "./SuperSelectTab/MultiSelectEditableEmpty";
import { MultiSelectNonEditableSelected } from "./SuperSelectTab/MultiSelectNonEditableSelected";
import { MultiSelectEditableSelected } from "./SuperSelectTab/MultiSelectEditableSelected";

import { OneNotification } from "./SuperSelectTab/OneNotification";
import { MultipleNotifications } from "./SuperSelectTab/MultipleNotifications";

export const SuperSelectTab = () => {
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
            <span className="mb-3">Single select / non-editable (empty)</span>
            <SingleSelectNonEditableEmpty disabled={form.get("disabled")} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Single select / editable (empty)</span>
            <SingleSelectEditableEmpty disabled={form.get("disabled")} />
          </div>
        </Col>
      </Row>

      {/*--------------------------------------------------------------------*/}

      <Row className="my-5">
        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Single select / non-editable (selected)</span>
            <SingleSelectNonEditableSelected disabled={form.get("disabled")} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Single select / editable (selected)</span>
            <SingleSelectEditableSelected disabled={form.get("disabled")} />
          </div>
        </Col>
      </Row>

      {/*--------------------------------------------------------------------*/}

      <Row className="my-5">
        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multi select / non-editable (empty)</span>
            <MultiSelectNonEditableEmpty disabled={form.get("disabled")} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multi select / editable (empty)</span>
            <MultiSelectEditableEmpty disabled={form.get("disabled")} />
          </div>
        </Col>
      </Row>

      {/*--------------------------------------------------------------------*/}

      <Row className="my-5">
        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multi select / non-editable (selected)</span>
            <MultiSelectNonEditableSelected disabled={form.get("disabled")} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multi select / editable (selected)</span>
            <MultiSelectEditableSelected disabled={form.get("disabled")} />
          </div>
        </Col>
      </Row>

      {/*--------------------------------------------------------------------*/}

      <Row className="my-5">
        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">One notification</span>
            <OneNotification disabled={form.get("disabled")} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column text-center">
            <span className="mb-3">Multiple notifications</span>
            <MultipleNotifications disabled={form.get("disabled")} />
          </div>
        </Col>
      </Row>
    </>
  );
}
