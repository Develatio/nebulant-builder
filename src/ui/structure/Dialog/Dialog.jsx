import { util } from "@joint/core";
import { useState, useEffect } from "react";
import { useForm } from "react-form-state-manager";

import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import { EventBus } from "@src/core/EventBus";
import { clone } from "@src/utils/lang/clone";
import { WBody } from "@src/ui/structure/WModal/WBody";
import { WModal } from "@src/ui/structure/WModal/WModal";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
};

const validateForm = ({ schema, data, validations, setValidations, submitted }) => {
  schema.validate(data, { abortEarly: false, }).then(_ => {
    if(!util.isEqual(validations, VALIDATION_BODY)) {
      setValidations(clone(VALIDATION_BODY));
    }
  }).catch(validationError => {
    const res = clone(VALIDATION_BODY);
    validationError.inner.forEach(error => {
      const v = error.type == "warning" ? res.warnings : res.errors;
      (v[error.path] = v[error.path] || []).push(error);
    });

    res.isValid = Object.keys(res.errors).length == 0;

    const newValidations = {
      submitted,
      ...res,
    };

    if(!util.isEqual(validations, newValidations)) {
      setValidations(newValidations);
    }
  });
}

export const Dialog = () => {
  const eventBus = new EventBus();

  const [data, setData] = useState({});
  const [visible, setVisibility] = useState(false);
  const form = useForm({ values: {} });

  const [validations, setValidations] = useState(VALIDATION_BODY);
  const [submitted, setSubmitted] = useState(false);

  if(data.schema) {
    validateForm({
      data: form.values,
      validations,
      setValidations,
      schema: data.schema,
      submitted,
    });
  }

  const open = (_msg, data) => {
    form.setInitialValues(clone(data.formValues));
    form.setParsedValues(clone(data.formValues));
    setData(data);
    setVisibility(true);
  }

  const close = () => {
    setData({});
    setVisibility(false);
  }

  useEffect(() => {
    const _open = (_msg, data) => open(_msg, data);
    const _close = () => close();

    eventBus.subscribe("OpenDialog", _open);
    eventBus.subscribe("CloseDialog", _close);

    return () => {
      eventBus.unsubscribe("OpenDialog", _open);
      eventBus.unsubscribe("CloseDialog", _close);
    };
  }, []);


  if(!visible) return "";

  let plainbody = "";
  if(data.body) {
    if(typeof data.body == "function") {
      plainbody = data.body({ form, validations });
    } else {
      plainbody = data.body;
    }
  }

  return (
    <WModal
      size={data.size || "lg"}
      visible={visible}
      close={() => {
        data.close && data.close();
        close();
      }}
    >
      <Container>
        <WHeader>{data.title}</WHeader>

        <WBody scrollable={data.scrollable}>
          {
            plainbody
          }
        </WBody>

        <WFooter>
          {
            data.cancel ? (
              <Button variant="secondary" className="me-auto" onClick={async () => {
                await data.cancel({ form, validations });
                close();
              }}>{ data.cancellabel || "Cancel" }</Button>
            ) : ""
          }

          {
            data.no ? (
              <Button variant="secondary" className="me-2" onClick={async () => {
                await data.no({ form, validations });
                close();
              }}>{ data.nolabel || "No" }</Button>
            ) : ""
          }

          {
            data.yes ? (
              <Button variant="primary" className="" onClick={async () => {
                await data.yes({ form, validations });
                setSubmitted(true);
                close();
              }}>{ data.yeslabel || "Yes" }</Button>
            ) : ""
          }

          {
            data.ok ? (
              <Button variant="primary" className="" onClick={async () => {
                await data.ok({ form, validations });
                setSubmitted(true);
                close();
              }}>{ data.oklabel || "Ok" }</Button>
            ) : ""
          }
        </WFooter>
      </Container>
    </WModal>
  );
}
