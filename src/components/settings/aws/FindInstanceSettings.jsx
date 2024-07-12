import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { Paging } from "@src/components/settings/aws/_Paging";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { SubnetAutocompleter } from "@src/components/autocompleters/aws/SubnetAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";
import { NetworkInterfaceAutocompleter } from "@src/components/autocompleters/aws/NetworkInterfaceAutocompleter";
import { AvailabilityZonesAutocompleter } from "@src/components/autocompleters/aws/AvailabilityZonesAutocompleter";
import { CreateInstanceInstanceTypeAutocompleter } from "@src/components/autocompleters/aws/CreateInstanceInstanceTypeAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { EC2_STATES } from "./_ec2_states";
import { ARCHITECTURES } from "./_architectures";
import { HYPERVISOR_TYPE } from "./_hypervisor_type";
import { VIRTUALIZATION_TYPE } from "./_virtualization_type";

const instances_filters = { type: "aws:instance" };
const subnets_filters = { type: "aws:subnet" };
const ifaces_filters = { type: "aws:network_interface" };

export const FindInstanceSettings = (props) => {
  const dql = new DiagramQL();

  const azs = usePromiseValue((new AvailabilityZonesAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const instance_types = usePromiseValue((new CreateInstanceInstanceTypeAutocompleter({
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),

    subnets: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...subnets_filters })
    ),

    ifaces: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...ifaces_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>
        {
          props.node.prop("data/id") === "find-instance" ? (
            "AWS - Find instance"
          ) : (
            "AWS - Find instances"
          )
        }
      </WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-instance" ? (
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
                    path={"parameters._InstanceName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter instances."}
                  ></TextInput>
                </Col>

                <Col sm={6} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>
                  <Alert variant="info" className="py-1 small">
                    Keep in mind that AWS's filtering is case sensitive.
                    You can use '?' for a single character match or '*' for a multi character match.
                  </Alert>
                </Col>

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Filters"}
                    label="Additional filters"
                    help_text="Narrow down the search further by applying more filters. Logical operator AND will be used if more than one filter is selected. If more than one value for each filter is selected, logical operator OR will be applied between each value (where applicable)."
                    choices={[
                      {
                        label: "Affinity",
                        name: "affinity",
                        value: [],
                      },
                      {
                        label: "Architecture",
                        name: "architecture",
                        value: [],
                      },
                      {
                        label: "Availability zone",
                        name: "availability-zone",
                        value: [],
                      },
                      {
                        label: "Hypervisor",
                        name: "hypervisor",
                        value: [],
                      },
                      {
                        label: "Instance lifecycle type",
                        name: "instance-lifecycle",
                        value: [],
                      },
                      {
                        label: "Instance type",
                        name: "instance-type",
                        value: [],
                      },
                      {
                        label: "Instance state",
                        name: "instance-state-name",
                        value: [],
                      },
                      {
                        label: "Kernel ID",
                        name: "kernel-id",
                        value: "",
                      },
                      {
                        label: "Network interface ID",
                        name: "network-interface.network-interface-id",
                        value: [],
                      },
                      {
                        label: "Subnet ID",
                        name: "subnet-id",
                        value: [],
                        multiple: true,
                      },
                      {
                        label: "Tag",
                        name: "tag",
                        value: ["", ""],
                        multiple: true,
                      },
                      {
                        label: "Tag key",
                        name: "tag-key",
                        value: [],
                      },
                      {
                        label: "Tenancy",
                        name: "tenancy",
                        value: [],
                      },
                      {
                        label: "Virtualization type",
                        name: "virtualization-type",
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
                              value.name == "affinity" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Affinity"}
                                  help_text={"The affinity of the instance."}
                                  placeholder={"Select an affinity"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: [
                                          {
                                            type: "value",
                                            label: "default",
                                            value: "default",
                                          },
                                          {
                                            type: "value",
                                            label: "host",
                                            value: "host",
                                          }
                                        ],
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "architecture" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Architecture"}
                                  help_text={"The architecture of the instance."}
                                  placeholder={"Select an architecture"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: ARCHITECTURES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "availability-zone" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Availability Zone"}
                                  help_text={"The Availability Zone in which to create the volume."}
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

                                // block-device-mapping.attach-time
                                // block-device-mapping.delete-on-termination
                                // block-device-mapping.device-name
                                // block-device-mapping.status
                                // block-device-mapping.volume-id
                                // client-token
                                // dns-name
                                // group-id
                                // group-name
                                // hibernation-options.configured
                                // host-id

                              ) : value.name == "hypervisor" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Hypervisor"}
                                  placeholder={"Select a hypervisor type"}
                                  help_text={"The hypervisor type."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: HYPERVISOR_TYPE,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>

                                // iam-instance-profile.arn
                                // image-id

                              ) : value.name == "instance-lifecycle" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Instance lifecycle"}
                                  help_text={"Indicates whether this is a Spot Instance or a Scheduled Instance."}
                                  placeholder={"Select an instance lifecycle"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: [
                                          {
                                            type: "value",
                                            label: "spot",
                                            value: "spot",
                                          },
                                          {
                                            type: "value",
                                            label: "scheduled",
                                            value: "scheduled",
                                          },
                                        ],
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>

                                // instance-state-code

                              ) : value.name == "instance-state-name" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Instance state"}
                                  help_text={"Filter by the state of an instance."}
                                  placeholder={"Select an instance state"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: EC2_STATES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>

                              ) : value.name == "instance-type" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  editable={true}
                                  multi={true}
                                  className="mb-0"
                                  label={"Instance type"}
                                  help_text={"The instance type."}
                                  placeholder={"Select or type an instance type"}
                                  groups={
                                    instance_types.data?.reduce((acc, it) => {
                                      const family = it.value[0];
                                      if(!acc.includes(family)) {
                                        acc.push(family);
                                      }
                                      return acc;
                                    }, []).map(family => {
                                      return {
                                        label: family.toUpperCase(),
                                        value: family,
                                      };
                                    })
                                  }
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new CreateInstanceInstanceTypeAutocompleter({
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run({ id: `${props.node.id}-parameters.Filters[${index}].value` });
                                    },
                                  ]}
                                ></DropdownInput>

                                // instance.group-id
                                // instance.group-name
                                // ip-address

                              ) : value.name == "kernel-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Kernel ID"}
                                  placeholder={"Type a kernel ID"}
                                  help_text={"The ID of the kernel."}
                                ></TextInput>

                                // key-name
                                // launch-index
                                // launch-time
                                // metadata-options.http-tokens
                                // metadata-options.http-put-response-hop-limit
                                // metadata-options.http-endpoint
                                // monitoring-state
                                // network-interface.addresses.private-ip-address
                                // network-interface.addresses.primary
                                // network-interface.addresses.association.public-ip
                                // network-interface.addresses.association.ip-owner-id
                                // network-interface.association.public-ip
                                // network-interface.association.ip-owner-id
                                // network-interface.association.allocation-id
                                // network-interface.association.association-id
                                // network-interface.attachment.attachment-id
                                // network-interface.attachment.instance-id
                                // network-interface.attachment.instance-owner-id
                                // network-interface.attachment.device-index
                                // network-interface.attachment.status
                                // network-interface.attachment.attach-time
                                // network-interface.attachment.delete-on-termination
                                // network-interface.availability-zone
                                // network-interface.description
                                // network-interface.group-id
                                // network-interface.group-name
                                // network-interface.ipv6-addresses.ipv6-address
                                // network-interface.mac-address

                              ) : value.name == "network-interface.network-interface-id" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Network interface ID"}
                                  placeholder={"Type a network interface ID"}
                                  help_text={"The ID of the network interface."}
                                  editable={true}
                                  multi={true}
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

                                // network-interface.owner-id
                                // network-interface.private-dns-name
                                // network-interface.requester-id
                                // network-interface.requester-managed
                                // network-interface.status
                                // network-interface.source-dest-check
                                // network-interface.subnet-id
                                // network-interface.vpc-id
                                // outpost-arn
                                // owner-id
                                // placement-group-name
                                // placement-partition-number
                                // platform
                                // private-dns-name
                                // private-ip-address
                                // product-code
                                // product-code.type
                                // ramdisk-id
                                // reason
                                // requester-id
                                // reservation-id
                                // root-device-name
                                // root-device-type
                                // source-dest-check
                                // spot-instance-request-id
                                // state-reason-code
                                // state-reason-message

                              ) : value.name == "subnet-id" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Subnet ID"}
                                  help_text={"The ID of the subnet to look for the instance."}
                                  placeholder={"Select or type a subnet ID"}
                                  editable={true}
                                  multi={true}
                                  groups={regions?.data}
                                  groupsDisallowUnselect={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: dqlResults.subnets,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new SubnetAutocompleter({
                                        node: props.node,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run({ id: `${props.node.id}-parameters.Filters[${index}].value` });
                                    },
                                  ]}
                                  notifications={
                                    <>
                                      <VariablesTags expected_vars_filter={[
                                        subnets_filters,
                                      ]} />
                                      <CliConnectivity />
                                    </>
                                  }
                                ></DropdownInput>
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
                                  help_text={"Use this filter to find all instances assigned a tag with a specific key, regardless of the tag value."}
                                ></MultiTextInput>
                              ) : value.name == "tenancy" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Tenancy"}
                                  help_text={"The tenancy of the instance."}
                                  placeholder={"Select a tenancy"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: [
                                          {
                                            type: "value",
                                            label: "dedicated",
                                            value: "dedicated",
                                          },
                                          {
                                            type: "value",
                                            label: "default",
                                            value: "default",
                                          },
                                          {
                                            type: "value",
                                            label: "host",
                                            value: "host",
                                          },
                                        ],
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "virtualization-type" ? (
                                  <DropdownInput
                                    node={props.node}
                                    form={props.form}
                                    validations={props.validations}
                                    path={`parameters.Filters[${index}].value`}
                                    className="mb-0"
                                    label={"Virtualization type"}
                                    placeholder={"Select a virtualization type"}
                                    help_text={"The virtualization type."}
                                    editable={true}
                                    multi={true}
                                    options={[
                                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                        return new StaticAutocompleter({
                                          data: VIRTUALIZATION_TYPE,
                                          filters: { searchPattern, page, perPage, group, pagingDetails },
                                        }).run();
                                      },
                                    ]}
                                  ></DropdownInput>

                                // vpc-id

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
                    path={"parameters.InstanceIds"}
                    label={"Instance ID"}
                    help_text={"Filter by specific ID."}
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
                        }).run({ id: `${props.node.id}-parameters.InstanceIds` });
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
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          {
            props.node.prop("data/id") === "find-instances" ? (
              <Paging {...props} />
            ) : ""
          }
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
