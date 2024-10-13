import { useState, useEffect } from "react";
import { useForm } from "react-form-state-manager";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { LOGLEVELS, LOGLEVELS_asstring } from "@src/core/Logger";

import { clone } from "@src/utils/lang/clone";

import { Heading } from "@src/ui/visual/Heading";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WModal } from "@src/ui/structure/WModal/WModal";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";
import { NumericInput } from "@src/ui/functionality/NumericInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";

const validateForm = () => {
  const res = {
    warnings: {},
    errors: {},
    isValid: true,
  };

  return res;
}

export const AppSettings = () => {
  const eventBus = new EventBus();
  const gconfig = new GConfig();

  const [visibility, setVisibility] = useState(false);

  const form = useForm({ values: {}});
  const [submitted, setSubmitted] = useState(false);

  const validations = {
    submitted,
    ...validateForm(form),
  };

  const close = () => {
    setVisibility(false);
    setSubmitted(false);
  }

  useEffect(() => {
    const open = () => {
      form.setInitialValues(clone(gconfig._config));
      form.setParsedValues(clone(gconfig._config));

      setVisibility(true);
    }

    eventBus.subscribe("OpenAppSettings", open);

    return () => {
      eventBus.unsubscribe("OpenAppSettings", open);
    };
  }, []);

  if(!visibility) return "";

  return (
    <WModal
      visible={visibility}
      close={close}
      className="app-settings"
      // We don't want the user to be able to (accidentally) close the window if
      // there are unsaved changes. Only the "close" button should be able to
      // discard unsaved changes. This is pure UX :)
      keyboard={!form.changed()}
    >
      <Container>
        <WHeader>
          App settings
        </WHeader>

        <WBody>
          <Tab.Container defaultActiveKey="ui">

            <Row className="mt-3">
              <Col sm={12}>
                <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                  <div className="tabsWrapper d-flex">
                    <Nav.Link eventKey="ui">UI</Nav.Link>
                    <Nav.Link eventKey="core">Core</Nav.Link>
                    <Nav.Link eventKey="cli">CLI</Nav.Link>
                    <Nav.Link eventKey="advanced">Advanced</Nav.Link>
                  </div>
                </Nav>
              </Col>
            </Row>

            <Tab.Content className="pt-3 border-0">
              <Tab.Pane eventKey="ui">
                <Row className="my-3">
                  <Col sm={12}>
                    <Heading>General settings</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <SimpleDropdownInput
                      form={form}
                      validations={validations}
                      path="ui.links.type"
                      label="Links type"
                      help_text="Set the links type (applies only to links created after changing this setting)"
                      options={[
                        { label: "Simple", value: "simple" },
                        { label: "Smart", value: "smart" },
                        // "Static" links are reserved for internal use only
                        //{ label: "Static", value: "static" }
                      ]}
                    ></SimpleDropdownInput>
                  </Col>

                  {
                    /*
                    <Col sm={12}>
                      <SimpleDropdownInput
                        form={form}
                        validations={validations}
                        path={"ui.shapes.orientation"}
                        label={"Shapes orientation"}
                        help_text={"Set the orientation of the shapes"}
                        options={[
                          { label: "Vertical", value: "vertical" },
                          { label: "Horizontal", value: "horizontal" },
                        ]}
                      ></SimpleDropdownInput>
                    </Col>
                    */
                  }

                  <Col sm={{offset: 2, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="ui.minimap"
                      label="Minimap"
                      help_text="Enable or disable the minimap (requires page reload)"
                    ></CheckboxInput>

                    <Alert variant="warning" className="py-1 small">
                      Minimap is CPU and GPU intensive. It requires 2x the resources
                      that would be otherwise used by the Nebulant Builder.
                    </Alert>
                  </Col>

                  <Col sm={{offset: 1, span: 4}} className="mt-5">
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="ui.toasts"
                      label="Toast messages"
                      help_text="Enable or disable the toast messages in the upper right corner"
                    ></CheckboxInput>

                    <Alert variant="info" className="py-1 small">
                      If you disable this, alerts will be shown only in the console.
                    </Alert>
                  </Col>

                  <Col sm={12}>
                    <Heading>Canvas & Grid</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="ui.grid.snap"
                      label="Grid snap"
                      help_text="Enable or disable grid snap"
                    ></CheckboxInput>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <NumericInput
                      form={form}
                      validations={validations}
                      min={1}
                      path="ui.grid.size"
                      label="Grid size"
                      suffix="px"
                      help_text="Set the size of each square of the grid"
                    ></NumericInput>
                  </Col>

                  <Col sm={12}>
                    <Heading>Appearance</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="ui.shadows"
                      label="Shadows"
                      help_text="Enable or disable shadows (requires page reload)"
                    ></CheckboxInput>

                    <Alert variant="warning" className="py-1 small">
                      Shadows are CPU and GPU intensive. Resources usage increases linearly
                      with the number of actions placed on the canvas.
                    </Alert>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="ui.highlight_animations"
                      label="Animated highlight"
                      help_text="Enable or disable highlight animations"
                    ></CheckboxInput>

                    <Alert variant="warning" className="py-1 small">
                      Animated highlight is CPU and GPU intensive.
                    </Alert>
                  </Col>

                  <Col sm={{offset: 1, span: 4}} className="mt-5">
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="ui.highlight_onhover"
                      label="Highlight on hover"
                      help_text="Enable or disable highlighting objects on mouse hover"
                    ></CheckboxInput>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="core">
                <Row className="my-3">
                  <Col sm={12}>
                    <Heading>Connectivity</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <NumericInput
                      form={form}
                      validations={validations}
                      placeholder="10000"
                      path="core.backend_timeout_ms"
                      label="Backend connection timeout"
                      suffix="ms"
                      help_text="Set the amount of time to wait before giving up when connecting to our backend"
                    ></NumericInput>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={12}>
                    <Heading>Debugging</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <SimpleDropdownInput
                      form={form}
                      validations={validations}
                      path="core.logging.logLevel"
                      label="Log level"
                      help_text="Set the log level"
                      options={[
                        {
                          label: `${LOGLEVELS_asstring[LOGLEVELS.DEBUG]}`.toUpperCase(),
                          value: LOGLEVELS.DEBUG,
                        },
                        {
                          label: `${LOGLEVELS_asstring[LOGLEVELS.INFO]}`.toUpperCase(),
                          value: LOGLEVELS.INFO,
                        },
                        {
                          label: `${LOGLEVELS_asstring[LOGLEVELS.SUCCESS]}`.toUpperCase(),
                          value: LOGLEVELS.SUCCESS,
                        },
                        {
                          label: `${LOGLEVELS_asstring[LOGLEVELS.WARNING]}`.toUpperCase(),
                          value: LOGLEVELS.WARNING,
                        },
                        {
                          label: `${LOGLEVELS_asstring[LOGLEVELS.ERROR]}`.toUpperCase(),
                          value: LOGLEVELS.ERROR,
                        },
                        {
                          label: `${LOGLEVELS_asstring[LOGLEVELS.CRITICAL]}`.toUpperCase(),
                          value: LOGLEVELS.CRITICAL,
                        },
                      ]}
                    ></SimpleDropdownInput>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="advanced.debug_network"
                      label="Debug network"
                      help_text="Enable or disable network debugging"
                    ></CheckboxInput>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="cli">
                <Row className="my-3">
                  <Col sm={12}>
                    <Heading>Connectivity</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <TextInput
                      form={form}
                      validations={validations}
                      placeholder="http://localhost:15678"
                      path="cli.endpoint"
                      label="CLI endpoint"
                      help_text="Set the URL (schema, ip / domain, port) that will be used to connect to the CLI server"
                    ></TextInput>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <TextInput
                      form={form}
                      validations={validations}
                      placeholder="ws://localhost:15678/ws"
                      path="cli.ws_endpoint"
                      label="CLI WebSocket endpoint"
                      help_text="Set the URL (schema, ip / domain, port) that will be used to connect to the CLI WS server"
                    ></TextInput>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <NumericInput
                      form={form}
                      validations={validations}
                      placeholder="10000"
                      path="cli.timeout_ms"
                      label="CLI connection timeout"
                      suffix="ms"
                      help_text="Set the amount of time to wait before giving up when connecting to the CLI"
                    ></NumericInput>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <NumericInput
                      form={form}
                      validations={validations}
                      placeholder="10000"
                      path="cli.retry_ms"
                      label="Retry period"
                      suffix="ms"
                      help_text="Set the amount of time to wait before retrying CLI operations"
                    ></NumericInput>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="cli.auto_connect"
                      label="Auto connect"
                      help_text="Start trying to connect to the CLI after the web app has been loaded"
                    ></CheckboxInput>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="advanced">

                <Row className="my-3">
                  <Col sm={12}>
                    <Heading>General</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="advanced.debug"
                      label="Enable debug mode"
                      help_text="Show debug menu / options"
                    ></CheckboxInput>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={12}>
                    <Heading>Validations</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="advanced.show_warnings"
                      label="Show warnings"
                      help_text="Show validation warnings on the bottom right corner of each action"
                    ></CheckboxInput>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <CheckboxInput
                      form={form}
                      validations={validations}
                      path="advanced.show_errors"
                      label="Show errors"
                      help_text="Show validation errors on the bottom right corner of each action"
                    ></CheckboxInput>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={12}>
                    <Heading variant="danger">Danger zone</Heading>
                  </Col>

                  <Col sm={{offset: 1, span: 4}}>
                    <Button
                      variant="outline-danger d-block w-100 mb-3"
                      onClick={() => {
                        navigator.serviceWorker.getRegistrations().then(registrations => {
                          registrations.forEach(registration => registration.unregister());
                        });
                      }}
                    >
                      Uninstall service worker
                    </Button>

                    <Alert variant="danger" className="text-center py-1 small">
                      Uninstall the service worker and all cached resources. Use this if you think you're not receiving
                      updates.
                    </Alert>
                  </Col>

                  <Col sm={{offset: 2, span: 4}}>
                    <Button
                      variant="outline-danger d-block w-100 mb-3"
                      onClick={() => {
                        gconfig.set("", {});
                        gconfig.persist.flush();
                      }}
                    >
                      Reset user settings
                    </Button>

                    <Alert variant="danger" className="text-center py-1 small">
                      Reset all user settings to their default values.
                    </Alert>
                  </Col>

                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </WBody>

        <WFooter>
          <Button
            variant="secondary"
            className="me-auto"
            onClick={() => {
              setVisibility(false);
            }}
          >Cancel</Button>

          <Button
            variant="primary"
            onClick={() => {
              setSubmitted(true);
              gconfig.set("", clone(form.values));
              gconfig.persist.flush();
              setVisibility(false);
            }}
          >Save</Button>
        </WFooter>
      </Container>
    </WModal>
  );
}
