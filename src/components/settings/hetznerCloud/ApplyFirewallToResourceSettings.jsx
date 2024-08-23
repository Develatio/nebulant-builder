import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { FirewallAutocompleter } from "@src/components/autocompleters/hetznerCloud/FirewallAutocompleter";
import { ServerAutocompleter } from "@src/components/autocompleters/hetznerCloud/ServerAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

const firewall_filters = { type: "hetznerCloud:firewall" };
const servers_filters = { type: "hetznerCloud:server" };

export const ApplyFirewallToResourceSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    servers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...servers_filters })
    ),

    firewalls: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...firewall_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner Cloud - Apply firewall to resource</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="servers" activeKey={props.form.get("parameters._activeTab")}>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "servers")} eventKey="servers">Apply to servers</Nav.Link>
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "labels")} eventKey="labels">Apply to a label</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="servers">
              <Row>
                <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.FirewallIds"}
                    label={"Firewall ID"}
                    help_text={"Select or type a firewall ID."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.firewalls,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new FirewallAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.FirewallIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          firewall_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>

                  <AnimatedArrow direction="right" className="mx-3 mt-5" />

                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ServerIds"}
                    label={"Server ID"}
                    help_text={"Select or type a server ID(s)."}
                    editable={true}
                    multi={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.servers,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new ServerAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.ServerIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          servers_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="labels">
              <Row className="my-3">
                <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.FirewallIds"}
                    label={"Firewall ID"}
                    help_text={"Select or type a firewall ID."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.firewalls,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new FirewallAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.FirewallIds2` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          firewall_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>

                  <AnimatedArrow direction="right" className="mx-3 mt-5" />

                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Label"}
                    label={"Label"}
                    placeholder={"Type a label"}
                    help_text={"The label that will be used to match the resources."}
                  ></TextInput>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the firewall to get applied to the resource"
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
