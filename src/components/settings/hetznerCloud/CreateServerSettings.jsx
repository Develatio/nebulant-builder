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
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { CodeEditor, highlight } from "@src/ui/functionality/CodeEditor";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { SshKeyAutocompleter } from "@src/components/autocompleters/hetznerCloud/SshKeyAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";
import { LocationAutocompleter } from "@src/components/autocompleters/hetznerCloud/LocationAutocompleter";
import { PrimaryIPAutocompleter } from "@src/components/autocompleters/hetznerCloud/PrimaryIPAutocompleter";
import { ServerTypeAutocompleter } from "@src/components/autocompleters/hetznerCloud/ServerTypeAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

const images_filters = { type: "hetznerCloud:image" };
const ssh_key_filters = { type: "hetznerCloud:ssh_key" };
const primary_ips_filters = { type: "hetznerCloud:primary_ip" };
const networks_filters = { type: "hetznerCloud:network" };

export const CreateServerSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    images: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...images_filters })
    ),

    ssh_keys: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...ssh_key_filters })
    ),

    primary_ips: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...primary_ips_filters })
    ),

    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Create server</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="general" activeKey={props.form.get("parameters._activeTab")}>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "general")} eventKey="general">General settings</Nav.Link>
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "network")} eventKey="network">Network settings</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="general">
              <Row className="my-3">
                <Col sm={4}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Name"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be assigned to the created server."}
                  ></TextInput>
                </Col>

                <Col sm={4}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Locations"}
                    label={"Location"}
                    help_text={"The location in which the server will be created."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new LocationAutocompleter({
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>
                </Col>

                <Col sm={4}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ImageIds"}
                    label={"Image ID"}
                    help_text={"Select or type an image ID."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.images,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          images_filters,
                        ]} />
                      </>
                    }
                  ></DropdownInput>
                </Col>

                <Col sm={4}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.SshKeys"}
                    label={"SSH keys"}
                    help_text={"The SSH keys that can be used to access this server."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.ssh_keys,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new SshKeyAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.SshKeyIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          ssh_key_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>

                <Col sm={8}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ServerTypes"}
                    label={"Server type"}
                    help_text={"Select or type a server type."}
                    editable={true}
                    multi={false}
                    groups={[
                      { label: "Dedicated", value: "dedicated" },
                      { label: "Shared (x86)", value: "shared_x86", selected: true },
                      { label: "Shared (arm)", value: "shared_arm" },
                    ]}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new ServerTypeAutocompleter({
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>
                </Col>
              </Row>

              <Row className="my-3">
                <Col sm={12}>
                  <CodeEditor
                    node={props.node}
                    form={props.form}
                    path={"parameters.UserData"}
                    label={"User data"}
                    help_text={"You can pass cloud-init compatible yaml and it will be executed after the first boot."}
                    highlight={code => {
                      const parsed = highlight(code);
                      const highlighted = parsed.value;

                      return highlighted.split("\n").map((line, i) => (
                        `<span class='editorLineNumber'>${i + 1}</span>${line}`
                      )).join("\n");
                    }}
                    preClassName={"language-yaml"}
                    placeholder={"#cloud-config"}
                  />
                </Col>
              </Row>

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
                              help_text1={"Add labels to the created volume."}
                              className="mb-0"
                            ></DualTextInput>
                          )
                        }
                      </WidgetRow>
                    )
                  })
                }
              </ArrayOfWidgets>
            </Tab.Pane>

            <Tab.Pane eventKey="network">
              <Row className="my-3">
                <Col sm={3}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.PublicNet.EnableIPv4"}
                    label={"Public IPv4"}
                    help_text={"Enable if you want to enable public IPv4 connectivity"}
                  ></CheckboxInput>
                </Col>

                {
                  props.form.get("parameters.PublicNet.EnableIPv4") ? (
                    <>
                      <Col sm={3}>
                        <CheckboxInput
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.PublicNet._autoAssignIPv4"}
                          label={"Assign a new IPv4"}
                          help_text={"Enable if you want to create a new primary IP and assign it to this server"}
                        ></CheckboxInput>
                      </Col>

                      <Col sm={6}>
                        {
                          props.form.get("parameters.PublicNet._autoAssignIPv4") ? "" : (
                            <DropdownInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={"parameters.PublicNet.IPv4"}
                              label={"Primary IPv4 ID"}
                              help_text={"Select or type a primary IPv4 ID."}
                              editable={true}
                              multi={false}
                              options={[
                                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                  return new StaticAutocompleter({
                                    data: dqlResults.primary_ips,
                                    filters: { searchPattern, page, perPage, group, pagingDetails },
                                  }).run();
                                },
                                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                  return new PrimaryIPAutocompleter({
                                    node: props.node,
                                    filters: { searchPattern, page, perPage, group, pagingDetails },
                                  }).run({ id: `${props.node.id}-parameters.PrimaryIpv4Ids` });
                                },
                              ]}
                              notifications={
                                <>
                                  <VariablesTags expected_vars_filter={[
                                    primary_ips_filters,
                                  ]} />
                                  <CliConnectivity />
                                </>
                              }
                            ></DropdownInput>
                          )
                        }
                      </Col>
                    </>
                  ) : ""
                }
              </Row>

              <Row className="my-3">
                <Col sm={3}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.PublicNet.EnableIPv6"}
                    label={"Public IPv6"}
                    help_text={"Enable if you want to enable public IPv6 connectivity"}
                  ></CheckboxInput>
                </Col>

                {
                  props.form.get("parameters.PublicNet.EnableIPv6") ? (
                    <>
                      <Col sm={3}>
                        <CheckboxInput
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.PublicNet._autoAssignIPv6"}
                          label={"Assign a new IPv6"}
                          help_text={"Enable if you want to create a new primary IP and assign it to this server"}
                        ></CheckboxInput>
                      </Col>

                      <Col sm={6}>
                        {
                          props.form.get("parameters.PublicNet._autoAssignIPv6") ? "" : (
                            <DropdownInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={"parameters.PublicNet.IPv6"}
                              label={"Primary IPv6 ID"}
                              help_text={"Select or type a primary IPv6 ID."}
                              editable={true}
                              multi={false}
                              options={[
                                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                  return new StaticAutocompleter({
                                    data: dqlResults.primary_ips,
                                    filters: { searchPattern, page, perPage, group, pagingDetails },
                                  }).run();
                                },
                                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                  return new PrimaryIPAutocompleter({
                                    node: props.node,
                                    filters: { searchPattern, page, perPage, group, pagingDetails },
                                  }).run({ id: `${props.node.id}-parameters.PrimaryIpv6Ids` });
                                },
                              ]}
                              notifications={
                                <>
                                  <VariablesTags expected_vars_filter={[
                                    primary_ips_filters,
                                  ]} />
                                  <CliConnectivity />
                                </>
                              }
                            ></DropdownInput>
                          )
                        }
                      </Col>
                    </>
                  ) : ""
                }
              </Row>

              <Row>
                <Col sm={6}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.NetworkIds"}
                    label={"Network ID"}
                    help_text={"Select or type the network IDs in which you want to attach the server to. At least 1 subnet must exist in each network."}
                    editable={true}
                    multi={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.networks,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new NetworkAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.NetworkIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          networks_filters,
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

        <AdvancedSettings>
          <Waiters {...props} />

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
