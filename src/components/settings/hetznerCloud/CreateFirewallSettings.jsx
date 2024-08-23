import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { InboundRules, OutboundRules } from "./_FirewallRule";

export const CreateFirewallSettings = (props) => {

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Create firewall</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="general" activeKey={props.form.get("parameters._activeTab")}>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "general")} eventKey="general">General</Nav.Link>
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "inbound")} eventKey="inbound">Inbound rules</Nav.Link>
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "outbound")} eventKey="outbound">Outbound rules</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="general">
              <Row className="my-3">
                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Name"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to create the firewall."}
                  ></TextInput>
                </Col>

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Labels"}
                    label="Labels"
                    help_text="Add labels"
                    choices={[
                      {
                        label: "Label",
                        name: "label",
                        value: ["", ""],
                        multiple: true,
                      },
                    ]}
                  >
                    {
                      props.form.get("parameters.Labels").map((value, index) => {
                        return (
                          <WidgetRow
                            key={value.__uniq}
                            index={index}
                            form={props.form}
                            path={"parameters.Labels"}
                          >
                            {
                              value.name == "label" && (
                                <DualTextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Labels[${index}].value`}
                                  prefix1="Key"
                                  prefix2="Value"
                                  placeholder={"Type a label key"}
                                  placeholder2={"Type a label value"}
                                  help_text1={"Add labels to the created network."}
                                  className="mb-0"
                                ></DualTextInput>
                              )
                            }
                          </WidgetRow>
                        )
                      })
                    }
                  </ArrayOfWidgets>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="inbound">
              <Row className="my-3">
                <Col sm={12}>
                  <InboundRules
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.InboundRules`}
                  />
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="outbound">
              <Row className="my-3">
                <Col sm={12}>
                  <OutboundRules
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.OutboundRules`}
                  />
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the firewall to get created"
          />

          <MaxRetries {...props} />
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
