import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { NumericInput } from "@src/ui/functionality/NumericInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { CodeEditor, highlight } from "@src/ui/functionality/CodeEditor";
import { PrivateTextInput } from "@src/ui/functionality/PrivateTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

export const SendEmailSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Send Email</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="content">

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link eventKey="content">Content</Nav.Link>
                  <Nav.Link eventKey="configuration">Configuration</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="content">
              <Row className="my-3">
                <Col sm={4}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.from"}
                    label={"From"}
                    placeholder={"John Doe <john.doe@domain.com>"}
                    help_text={"Email of the sender. It can be a plain email or a mailbox string in RFC 5322 format"}
                  ></TextInput>
                </Col>

                <Col sm={8}>
                  <MultiTextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.to"}
                    label={"To"}
                    placeholder={"John Doe <john.doe@domain.com>"}
                    help_text={"Emails of the recipients. It can be a plain email or a mailbox string in RFC 5322 format"}
                  ></MultiTextInput>
                </Col>

                <Col sm={12}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.subject"}
                    label={"Subject"}
                    placeholder={"Hi!"}
                    help_text={"The subject of the email message."}
                  ></TextInput>
                </Col>

                <Col sm={12}>
                  <Tabs defaultActiveKey="plain">
                    <Tab eventKey="plain" title="Plain text">
                      <Row className="my-3 px-3 mb-n3">
                        <CodeEditor
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.body.plain"}
                          highlight={code => (
                            code.split("\n").map((line, i) => (
                              `<span class='editorLineNumber'>${i + 1}</span>${line}`
                            )).join("\n")
                          )}
                          preClassName={"language-plaintext"}
                          placeholder=""
                          label=""
                          help_text={"The plain text body of the email."}
                        ></CodeEditor>
                      </Row>
                    </Tab>

                    <Tab eventKey="html" title="HTML">
                      <Row className="my-3 px-3 mb-n3">
                        <CodeEditor
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.body.html"}
                          highlight={code => (
                            highlight(code).value.split("\n").map((line, i) => (
                              `<span class='editorLineNumber'>${i + 1}</span>${line}`
                            )).join("\n")
                          )}
                          preClassName={"language-xml"}
                          placeholder=""
                          label=""
                          help_text={"The HTML body of the email."}
                        ></CodeEditor>
                      </Row>
                    </Tab>

                    <Tab eventKey="attachments" title="Attachments">
                      <Row className="my-3 px-3 mb-n3">
                        <Col sm={12}>
                          <ArrayOfWidgets
                            form={props.form}
                            validations={props.validations}
                            path={"parameters.attachments"}
                            label="Attachments"
                            help_text="Add attachments"
                            choices={[
                              {
                                label: "Attachment",
                                name: "attachment",
                                value: "",
                                multiple: true,
                              },
                            ]}
                          >
                            {
                              props.form.get("parameters.attachments").map((value, index) => {
                                return (
                                  <WidgetRow
                                    key={value.__uniq}
                                    index={index}
                                    itemSize={12}
                                    form={props.form}
                                    path={"parameters.attachments"}
                                  >
                                    <TextInput
                                      form={props.form}
                                      validations={props.validations}
                                      path={`parameters.attachments[${index}].value`}
                                      placeholder={"File path"}
                                      help_text={"Type the path (relative to the CLI or absolute) of the file you wish to attach"}
                                      className="mb-0"
                                    ></TextInput>
                                  </WidgetRow>
                                )
                              })
                            }
                          </ArrayOfWidgets>
                        </Col>
                      </Row>
                    </Tab>
                  </Tabs>
                </Col>

              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="configuration">
              <Row className="my-3">

                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.server"}
                    label={"Server"}
                    placeholder={"smtp.mydomain.com"}
                    help_text={"The SMTP server to be used to send the email."}
                  ></TextInput>
                </Col>

                <Col sm={6}>
                  <NumericInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.port"}
                    label={"Port"}
                    placeholder={"587"}
                    help_text={"The port of the SMTP server to which to connect (usually 25, 465 or 587)."}
                  ></NumericInput>
                </Col>

                <Col sm={6}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ignore_invalid_ssl"}
                    label={"Ignore invalid SSL certificate"}
                    help_text={"Don't abort the connection even if the SSL certificate is invalid."}
                  ></CheckboxInput>
                </Col>

                <Col sm={6}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.force_ssl"}
                    label={"Force TLS/SSL"}
                    help_text={"Skip STARTTLS and use encrypted-from-the-beginning connection."}
                  ></CheckboxInput>
                </Col>

                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.username"}
                    label={"Username"}
                    placeholder={""}
                    help_text={"The username for the SMTP login."}
                  ></TextInput>
                </Col>

                <Col sm={6}>
                  <PrivateTextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.password"}
                    label={"Password"}
                    placeholder={""}
                    help_text={"The password for the SMTP login."}
                  ></PrivateTextInput>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          <MaxRetries {...props} />

          <Row className={`bg-almost-dark px-2 py-3 border rounded mb-3`}>
            <Col sm={6}>
              <MultiTextInput
                node={props.node}
                form={props.form}
                validations={props.validations}
                path={"parameters.cc"}
                label={"Cc"}
                placeholder={"John Doe <john.doe@domain.com>"}
                help_text={"Emails of the recipients. It can be a plain email or a mailbox string in RFC 5322 format"}
              ></MultiTextInput>
            </Col>

            <Col sm={6}>
              <MultiTextInput
                node={props.node}
                form={props.form}
                validations={props.validations}
                path={"parameters.bcc"}
                label={"Bcc"}
                placeholder={"John Doe <john.doe@domain.com>"}
                help_text={"Emails of the recipients. It can be a plain email or a mailbox string in RFC 5322 format"}
              ></MultiTextInput>
            </Col>
          </Row>

          <Row className={`bg-almost-dark px-2 py-3 border rounded mb-0`}>
            <Col sm={6}>
              <TextInput
                node={props.node}
                form={props.form}
                validations={props.validations}
                path={"parameters.reply_to"}
                label={"Reply to"}
                placeholder={"John Doe <john.doe@domain.com>"}
                help_text={"Email that the receiver can reply to. It can be a plain email or a mailbox string in RFC 5322 format"}
              ></TextInput>
            </Col>
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
