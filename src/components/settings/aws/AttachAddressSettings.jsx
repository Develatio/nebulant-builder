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

import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { AddressAutocompleter } from "@src/components/autocompleters/aws/AddressAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";
import { NetworkInterfaceAutocompleter } from "@src/components/autocompleters/aws/NetworkInterfaceAutocompleter";

const eips_filters = { type: "aws:elastic_ip" };
const instances_filters = { type: "aws:instance" };
const ifaces_filters = { type: "aws:network_interface" };

export const AttachAddressSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    eips: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...eips_filters })
    ),

    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),

    ifaces: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...ifaces_filters })
    ),
  }));

  return (
    <Container className="aws_attach_address_settings">
      <WHeader help={props.help}>AWS - Attach elastic IP</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="instance" activeKey={props.form.get("parameters._activeTab")}>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "instance")} eventKey="instance">Attach to an instance</Nav.Link>
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "network_interface")} eventKey="network_interface">Attach to a network interface</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="instance">
              <Row className="my-3">
                <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.AllocationId"}
                    label={"Allocation ID"}
                    help_text={"Select or type an allocation ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.eips,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new AddressAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.AllocationId` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          eips_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>

                  <AnimatedArrow direction="right" className="mx-3 mt-5" />

                  <DropdownInput
                    key="instance"
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.InstanceId"}
                    label={"Instance ID"}
                    help_text={"Select or type an instance ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.instances,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new InstanceAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.InstanceId` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          instances_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="network_interface">
              <Row className="my-3">
                <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.AllocationId"}
                    label={"Allocation ID"}
                    help_text={"Select or type an allocation ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.eips,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new AddressAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.AllocationId` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          eips_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>

                  <AnimatedArrow direction="right" className="mx-3 mt-5" />

                  <DropdownInput
                    key="network_interface"
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.NetworkInterfaceId"}
                    label={"Network interface ID"}
                    help_text={"Select or type a network interface ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.ifaces,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new NetworkInterfaceAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.NetworkInterfaceId` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          ifaces_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        <Row>
          <Col sm={6} className="d-flex align-items-start">
            <CheckboxInput
              form={props.form}
              validations={props.validations}
              path={"parameters.AllowReassociation"}
              label={"Allow reassociation"}
              help_text={"Allow an elastic IP address that is already associated with an instance or network interface to be reassociated with the specified instance or network interface."}
            ></CheckboxInput>
          </Col>
        </Row>

        <AdvancedSettings>
          <MaxRetries className="mb-0" {...props} />
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
