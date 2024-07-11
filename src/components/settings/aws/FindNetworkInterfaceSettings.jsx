import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { Paging } from "@src/components/settings/aws/_Paging";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";
import { NetworkInterfaceAutocompleter } from "@src/components/autocompleters/aws/NetworkInterfaceAutocompleter";
import { AvailabilityZonesAutocompleter } from "@src/components/autocompleters/aws/AvailabilityZonesAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

const ifaces_filters = { type: "aws:network_interface" };
const instances_filters = { type: "aws:instance" };

export const FindNetworkInterfaceSettings = (props) => {
  const dql = new DiagramQL();

  const azs = usePromiseValue((new AvailabilityZonesAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    ifaces: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...ifaces_filters })
    ),

    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Find Network Interface</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-network-interface" ? (
                      <Nav.Link onClick={() => props.form.set("parameters._activeTab", "id")} eventKey="id">Find by ID</Nav.Link>
                    ) : ""
                  }
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="filters">
              <Row className="my-3">
                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._NetworkInterfaceName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter network interfaces."}
                  ></TextInput>
                </Col>

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Filters"}
                    label="Filters"
                    help_text="Narrow down the search further by applying filters. Logical operator AND will be used if more than one filter is selected. If more than one value for each filter is selected, logical operator OR will be applied between each value (where applicable)."
                    choices={[
                      {
                        label: "Elastic IPv4",
                        name: "association.public-ip",
                        value: [],
                      },
                      {
                        label: "IPv4 DNS name",
                        name: "association.public-dns-name",
                        value: [],
                      },
                      {
                        label: "IPv6 address",
                        name: "ipv6-addresses.ipv6-address",
                        value: [],
                      },
                      {
                        label: "Private IPv4 address",
                        name: "private-ip-address",
                        value: [],
                      },
                      {
                        label: "Private IPv4 DNS name",
                        name: "private-dns-name",
                        value: [],
                      },
                      {
                        label: "Instance ID",
                        name: "attachment.instance-id",
                        value: [],
                      },
                      {
                        label: "Availability Zone",
                        name: "availability-zone",
                        value: [],
                      },
                      {
                        label: "Owner ID",
                        name: "owner-id",
                        value: [],
                      },
                      {
                        label: "Subnet ID",
                        name: "subnet-id",
                        value: [],
                      },
                      {
                        label: "Tag",
                        name: "tag",
                        value: ["", ""],
                      },
                      {
                        label: "Tag key",
                        name: "tag-key",
                        value: [],
                      },
                      {
                        label: "VPC ID",
                        name: "vpc-id",
                        value: [],
                      },
                    ]}
                  >
                    {
                      props.form.get("parameters.Filters").map((value, index) => {
                        return (
                          <WidgetRow
                            key={value.__uniq}
                            index={index}
                            form={props.form}
                            path={"parameters.Filters"}
                          >
                            {
                              // addresses.private-ip-address
                              // addresses.primary
                              // addresses.association.public-ip
                              // addresses.association.owner-id
                              // association.association-id
                              // association.allocation-id
                              // association.ip-owner-id

                              value.name == "association.public-ip" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Public IP address"}
                                  placeholder={"Type an IP address"}
                                  help_text={"The address of the elastic IP address (IPv4) bound to the network interface."}
                                ></TextInput>
                              ) : value.name == "association.public-dns-name" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"IPv4 DNS name"}
                                  placeholder={"Type a DNS name"}
                                  help_text={"The public DNS name for the network interface (IPv4)."}
                                ></TextInput>

                              // attachment.attachment-id
                              // attachment.attach-time
                              // attachment.delete-on-termination
                              // attachment.device-index

                              ) : value.name == "attachment.instance-id" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Instance ID"}
                                  placeholder={"Type an instance ID"}
                                  help_text={"The ID of the instance the volume is attached to."}
                                  editable={true}
                                  multi={true}
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
                                      }).run({ id: `${props.node.id}-parameters.Filters[${index}].value` });
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

                              // attachment.instance-owner-id
                              // attachment.status

                              ) : value.name == "availability-zone" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Availability Zone"}
                                  help_text={"The Availability Zone of the network interface."}
                                  placeholder={"Select an Availability Zone"}
                                  editable={true}
                                  multi={true}
                                  groups={regions?.data}
                                  groupsDisallowUnselect={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      const data = azs?.data?.filter?.(r => r.value.startsWith(group)) || [];

                                      return new StaticAutocompleter({
                                        data,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>

                              // description
                              // group-id
                              // group-name

                              ) : value.name == "ipv6-addresses.ipv6-address" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"IPv6 address"}
                                  placeholder={"Type an IPv6 address"}
                                  help_text={"An IPv6 address associated with the network interface."}
                                ></TextInput>

                              // mac-address
                              // network-interface-id

                              ) : value.name == "owner-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Owner ID"}
                                  placeholder={"Type an owner ID"}
                                  help_text={"The AWS account ID of the owner of the network interface."}
                                ></TextInput>
                              ) : value.name == "subnet-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Subnet ID"}
                                  placeholder={"Type a Subnet ID"}
                                  help_text={"The ID of the subnet to which the network interface belongs to."}
                                ></TextInput>
                              ) : value.name == "private-ip-address" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"IPv4 private address"}
                                  placeholder={"Type an IPv4 address"}
                                  help_text={"The private IPv4 address or addresses of the network interface."}
                                ></TextInput>
                              ) : value.name == "private-dns-name" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Private IPv4 DNS name"}
                                  placeholder={"Type a DNS name"}
                                  help_text={"The private DNS name of the network interface (IPv4)."}
                                ></TextInput>

                              // requester-id
                              // requester-managed
                              // source-dest-check
                              // status

                              ) : value.name == "tag" ? (
                                <DualTextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Tag"}
                                  placeholder={"Type a tag key"}
                                  placeholder2={"Type a tag value"}
                                  help_text1={"Use the tag key as the filter name and the tag value as the filter value."}
                                ></DualTextInput>
                              ) : value.name == "tag-key" ? (
                                <MultiTextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Tag key"}
                                  placeholder={"Type a key of a tag assigned to the image"}
                                  help_text={"Use this filter to find all Network Interfaces assigned a tag with a specific key, regardless of the tag value."}
                                ></MultiTextInput>
                              ) : value.name == "vpc-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"VPC ID"}
                                  placeholder={"Type a VPC ID"}
                                  help_text={"The ID of the VPC to which the network interface belongs to."}
                                ></TextInput>
                              ) : ""
                            }
                          </WidgetRow>
                        )
                      })
                    }
                  </ArrayOfWidgets>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="id">
              <Row className="my-3">
                <Col sm={12}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.NetworkInterfaceIds"}
                    label={"Network interface ID"}
                    help_text={"Filter by specific ID."}
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
                        }).run({ id: `${props.node.id}-parameters.NetworkInterfaceIds` });
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

        <AdvancedSettings>
          {
            props.node.prop("data/id") === "find-network-interfaces" ? (
              <Paging {...props} />
            ) : ""
          }
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
