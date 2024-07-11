import { util } from "@joint/core";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import Url from "@src/utils/domurl";
import { clone } from "@src/utils/lang/clone";
import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { body_form_data } from "./HttpRequestSettings/_body_form_data";
import { body_form_urlencoded } from "./HttpRequestSettings/_body_form_urlencoded";

export const HttpRequestSettings = (props) => {
  const endpoint = props.form.get("parameters.endpoint");
  const url = new Url(endpoint);
  const isValid = url.host != window.location.host;
  const touched = props.form.getTouched("parameters.endpoint");

  // Check how we should render the endpoint / parameters
  if(touched) {
    // The endpoint was changed, remove all parameters and parse the new URL
    if(isValid) {
      setTimeout(() => {
        const parameters = Object.entries(url.query).map(([k, v]) => ({
          enabled: true,
          name: k,
          value: v || "",
        }));

        props.form.set("parameters.parameters", parameters);
        props.form.setTouched("parameters.endpoint", false);
      });
    } else {
      setTimeout(() => {
        props.form.set("parameters.parameters", []);
        props.form.setTouched("parameters.endpoint", false);
      })
    }
  } else if(isValid) {
    // Something else changed, try to construct the URL from the parameters
    const oldParams = Object.entries(clone(url.query)).map(([k, v]) => ({
      [k]: v || "",
    })).reduce((prev, curr) => Object.assign(prev, curr), {});

    url.clearQuery();
    props.form.get("parameters.parameters").filter(p => p.enabled).map(p => {
      url.query[p.name] = p.value || "";
    });

    if(!util.isEqual(oldParams, clone(url.query))) {
      setTimeout(() => {
        props.form.set("parameters.endpoint", url.toString());
      });
    }
  }

  return (
    <Container className="http_request_settings">
      <WHeader help={props.help}>HTTP Request</WHeader>

      <WBody>

        <Row className="mt-3 mb-3">
          <Col sm={12}>
            <div className="d-flex">
              <div className="me-3 http_verb">
                <SimpleDropdownInput
                  form={props.form}
                  validations={props.validations}
                  path={"parameters.http_verb"}
                  label={"HTTP verb"}
                  help_text={"Select the HTTP verb"}
                  options={[
                    { type: "value", label: "GET", value: "GET", },
                    { type: "value", label: "POST", value: "POST", },
                    { type: "value", label: "PUT", value: "PUT", },
                    { type: "value", label: "PATCH", value: "PATCH", },
                    { type: "value", label: "DELETE", value: "DELETE", },
                  ]}
                ></SimpleDropdownInput>
              </div>

              <div className="w-100">
                <TextInput
                  node={props.node}
                  form={props.form}
                  validations={props.validations}
                  path={"parameters.endpoint"}
                  label={"Endpoint"}
                  placeholder={""}
                  help_text={"Request endpoint"}
                ></TextInput>
              </div>
            </div>
          </Col>

          <Col sm={12}>
            <Tabs defaultActiveKey="params" className="tabs-rounded-bottom">
              <Tab eventKey="params" title="Params" className="parameters">
                <Row className="p-4 pb-2">
                  {
                    props.form.get("parameters.parameters").map((_parameter, idx) => {
                      return (
                        <Col sm={12} key={idx}>
                          <div className="d-flex align-items-center">
                            <div className="enabled">
                              <CheckboxInput
                                form={props.form}
                                validations={props.validations}
                                path={`parameters.parameters[${idx}].enabled`}
                                label={""}
                                help_text={""}
                              ></CheckboxInput>
                            </div>

                            <div className="flex-grow-1 me-3">
                              <TextInput
                                node={props.node}
                                form={props.form}
                                validations={props.validations}
                                path={`parameters.parameters[${idx}].name`}
                                label={""}
                                placeholder={""}
                                help_text={""}
                              ></TextInput>
                            </div>

                            <div className="flex-grow-1">
                              <TextInput
                                node={props.node}
                                form={props.form}
                                validations={props.validations}
                                path={`parameters.parameters[${idx}].value`}
                                label={""}
                                placeholder={""}
                                help_text={""}
                              ></TextInput>
                            </div>

                            <div className="d-flex justify-content-center align-items-start mb-4 ms-2">
                              <button
                                type="button"
                                className="btn-close scale-08 me-2"
                                onClick={() => props.form.delete("parameters.parameters", idx)}
                              ></button>
                            </div>
                          </div>
                        </Col>
                      )
                    })
                  }
                </Row>

                <Row className="rounded-bottom mx-n1-extra mb-n1-extra">
                  <Col sm={12} className="text-center">
                    <Button
                      variant="outline-primary d-block w-100"
                      onClick={() => props.form.append("parameters.parameters", {
                        enabled: true,
                        name: "",
                        value: "",
                      })}
                    >
                      Add parameter
                    </Button>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="headers" title="Headers">
                <Row className="p-4 pb-2">
                  {
                    props.form.get("parameters.headers").map((_parameter, idx) => {
                      return (
                        <Col sm={12} key={idx}>
                          <div className="d-flex align-items-center">
                            <div className="enabled">
                              <CheckboxInput
                                form={props.form}
                                validations={props.validations}
                                path={`parameters.headers[${idx}].enabled`}
                                label={""}
                                help_text={""}
                              ></CheckboxInput>
                            </div>

                            <div className="flex-grow-1 me-3">
                              <TextInput
                                node={props.node}
                                form={props.form}
                                validations={props.validations}
                                path={`parameters.headers[${idx}].name`}
                                label={""}
                                placeholder={""}
                                help_text={""}
                              ></TextInput>
                            </div>

                            <div className="flex-grow-1">
                              <TextInput
                                node={props.node}
                                form={props.form}
                                validations={props.validations}
                                path={`parameters.headers[${idx}].value`}
                                label={""}
                                placeholder={""}
                                help_text={""}
                              ></TextInput>
                            </div>

                            <div className="d-flex justify-content-center align-items-start mb-4 ms-2">
                              <button
                                type="button"
                                className="btn-close scale-08 me-2"
                                onClick={() => props.form.delete("parameters.headers", idx)}
                              ></button>
                            </div>
                          </div>
                        </Col>
                      )
                    })
                  }
                </Row>

                <Row className="rounded-bottom mx-n1-extra mb-n1-extra">
                  <Col sm={12} className="text-center">
                    <Button
                      variant="outline-primary d-block w-100"
                      onClick={() => props.form.append("parameters.headers", {
                        enabled: true,
                        name: "",
                        value: "",
                      })}
                    >
                      Add header
                    </Button>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="body" title="Body">
                <Row className="p-4 pb-2">
                  <Col sm={3}>
                    <SimpleDropdownInput
                      form={props.form}
                      validations={props.validations}
                      path={"parameters.body_type"}
                      label={"Body type"}
                      help_text={"Select the body type"}
                      options={[
                        { type: "value", label: "none", value: "none", },
                        { type: "value", label: "form-data", value: "form-data", },
                        { type: "value", label: "x-www-form-urlencoded", value: "x-www-form-urlencoded", },
                        { type: "value", label: "raw", value: "raw", },
                        { type: "value", label: "binary", value: "binary", },
                      ]}
                    ></SimpleDropdownInput>
                  </Col>

                  {
                    props.form.get("parameters.body_type") == "raw" && (
                      <Col sm={4}>
                        <SimpleDropdownInput
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.body_content_type_header"}
                          label={"Select content-type header"}
                          help_text={"Select the body type"}
                          options={[
                            { type: "value", label: "Text", value: "text", },
                            { type: "value", label: "Javascript", value: "javascript", },
                            { type: "value", label: "JSON", value: "json", },
                            { type: "value", label: "HTML", value: "html", },
                            { type: "value", label: "XML", value: "xml", },
                            { type: "value", label: "Custom (set in 'Headers' tab)", value: "custom", },
                          ]}
                        ></SimpleDropdownInput>
                      </Col>
                    )
                  }
                </Row>

                {
                  props.form.get("parameters.body_type") == "form-data" ? (
                    body_form_data(props)
                  ) : props.form.get("parameters.body_type") == "x-www-form-urlencoded" ? (
                    body_form_urlencoded(props)
                  ) : props.form.get("parameters.body_type") == "raw" ? (
                    <Row className="p-4 pb-2 pt-0">
                      <TextInput
                        as="textarea"
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={"parameters.body_raw"}
                        label={"Body raw content"}
                        placeholder={""}
                        help_text={"The raw content of the body"}
                      ></TextInput>
                    </Row>
                  ) : props.form.get("parameters.body_type") == "binary" ? (
                    <Row className="p-4 pb-2 pt-0">
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={"parameters.body_binary"}
                        label={"File path"}
                        placeholder={"./path/to/a/file"}
                        help_text={"Type a relative or absolute path to a file"}
                      ></TextInput>
                    </Row>
                  ) : ""
                }
              </Tab>
            </Tabs>
          </Col>
        </Row>

        <AdvancedSettings>
          <MaxRetries className="mb-3" {...props} />

          <Row className="bg-almost-dark px-2 py-3 border rounded mb-3">
            <Col sm={12}>
              <CheckboxInput
                form={props.form}
                validations={props.validations}
                path={`parameters.ignore_invalid_certs`}
                label={"Ignore invalid certs"}
                help_text={"HTTP requests will be made even if https scheme is used and the certificate is invalid."}
              ></CheckboxInput>
            </Col>
          </Row>

          <Row className="bg-almost-dark px-2 py-3 border rounded mb-0">
            <Col sm={6}>
              <CheckboxInput
                form={props.form}
                validations={props.validations}
                path={`parameters.use_cookie_jar`}
                label={"Use a cookie jar"}
                help_text={"Store all received cookies in a cookie jar and reuse them in consecutive requests or in other 'HTTP Request' actions."}
              ></CheckboxInput>
            </Col>

            {
              props.form.get("parameters.use_cookie_jar") ? (
                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.cookie_jar"}
                    label={"Cookie jar name"}
                    placeholder={""}
                    help_text={"Type a name for the cookie jar."}
                  ></TextInput>
                </Col>
              ) : ""
            }
          </Row>
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Output variable"}
          ></OutputVariable>
        </HasOutput>
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
