import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Tab from "react-bootstrap/esm/Tab";
import Nav from "react-bootstrap/esm/Nav";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { VolumeTypeSizeSettings } from "@src/components/settings/aws/_VolumeTypeSizeSettings";

import { ImageAutocompleter } from "@src/components/autocompleters/aws/ImageAutocompleter";
import { SubnetAutocompleter } from "@src/components/autocompleters/aws/SubnetAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { KeyPairNameAutocompleter } from "@src/components/autocompleters/aws/KeyPairNameAutocompleter";
import { SecurityGroupAutocompleter } from "@src/components/autocompleters/aws/SecurityGroupAutocompleter";
import { CreateInstanceInstanceTypeAutocompleter } from "@src/components/autocompleters/aws/CreateInstanceInstanceTypeAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { AmiDetails } from "./_AmiDetails";
import { InstanceTypeExplanation } from "./_InstanceTypeExplanation";

const amis_filters = { type: "aws:ami" };
const key_pairs_filters = { type: "aws:key_pair" };
const security_groups_filters = { type: "aws:security_group" };
const subnets_filters = { type: "aws:subnet" };

export const CreateInstanceSettings = (props) => {
  const dql = new DiagramQL();

  const instance_types = usePromiseValue((new CreateInstanceInstanceTypeAutocompleter({
    filters: { perPage: Infinity },
  })).run(), {});

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    amis: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...amis_filters })
    ),

    key_pairs: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...key_pairs_filters })
    ),

    security_groups: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...security_groups_filters })
    ),

    subnets: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...subnets_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Create Instance</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="instance">

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link eventKey="instance">Instance</Nav.Link>
                  <Nav.Link eventKey="network">Network</Nav.Link>
                  <Nav.Link eventKey="storage">Storage</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="instance">
              <Row>
                {
                  // AdditionalInfo
                  // CapacityReservationSpecification - Information about the Capacity Reservation targeting option.
                  // ClientToken - Unique, case-sensitive identifier you provide to ensure the idempotency of the request.
                  // CpuOptions - The CPU options for the instance.
                  // CreditSpecification - Default: standard (T2 instances) or unlimited (T3/T3a instances)
                }

                <Col sm={8}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._InstanceName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be assigned to the created instance."}
                  ></TextInput>

                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ImageId"}
                    editable={true}
                    multi={false}
                    label={"Image ID"}
                    help_text={"The ID of the AMI."}
                    placeholder={"Select or type an image ID"}
                    searchPattern="debian"
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.amis,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new ImageAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.ImageId` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          amis_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>

                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.InstanceType"}
                    editable={true}
                    multi={false}
                    label={"Instance type"}
                    help_text={"The instance type."}
                    placeholder={"Select or type an instance type"}
                    groups={
                      instance_types.data?.reduce?.((acc, it) => {
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
                        }).run({ id: `${props.node.id}-parameters.InstanceType` });
                      },
                    ]}
                  ></DropdownInput>


                {
                  // EbsOptimized - Indicates whether the instance is optimized for Amazon EBS I/O.
                  // ElasticGpuSpecification - An elastic GPU to associate with the instance.
                  // ElasticInferenceAccelerators - An elastic inference accelerator to associate with the instance.
                  // EnclaveOptions - Indicates whether the instance is enabled for AWS Nitro Enclaves.
                  // HibernationOptions - Indicates whether an instance is enabled for hibernation.
                  // IamInstanceProfile - The IAM instance profile.
                }

                {
                  // InstanceInitiatedShutdownBehavior - Indicates whether an instance stops or terminates when you initiate shutdown from the instance.
                  // InstanceMarketOptions - The market (purchasing) option for the instances.
                }

                {
                  // KernelId - The ID of the kernel.
                }

                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.KeyName"}
                    editable={true}
                    multi={false}
                    label={"Key pair"}
                    help_text={"The name of the key pair to assign to the instance."}
                    placeholder={"Select or type a key pair"}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.key_pairs,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new KeyPairNameAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.KeyName` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          key_pairs_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>

                {
                  // LaunchTemplate - The launch template to use to launch the instances.
                  // LicenseSpecifications - The license configurations.
                }

                {/*
                <NumericInput
                  form={props.form}
                  validations={props.validations}
                  path={"parameters.MaxCount"}
                  label={"Max count"}
                  placeholder={"Type an amount of maximum instances to be launched"}
                  help_text={"The maximum number of instances to launch."}
                ></NumericInput>
                */}

                {
                  // MetadataOptions - The metadata options for the instance.
                }

                {/*
                <NumericInput
                  form={props.form}
                  validations={props.validations}
                  path={"parameters.MinCount"}
                  label={"Min count"}
                  placeholder={"Type an amount of minimum instances to be launched"}
                  help_text={"The minimum number of instances to launch."}
                ></NumericInput>
                */}

                {
                  // Monitoring - Specifies whether detailed monitoring is enabled for the instance.
                  // Placement - The placement for the instance.
                  // RamdiskId - The ID of the RAM disk to select.
                  // UserData - The user data to make available to the instance.
                }

                {/*
                <CheckboxInput
                  form={props.form}
                  validations={props.validations}
                  path={"parameters.DisableApiTermination"}
                  label={"Disable API termination"}
                  help_text={"If you set this parameter to true, you can't terminate the instance using the Amazon EC2 console, CLI, or API."}
                ></CheckboxInput>
                */}

                <Col sm={4} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>

                  <AmiDetails amiid={props.form.get("parameters.ImageId")[0]} />

                  <Alert variant="info" className="py-1 small">
                    <div className="text-center mb-3">
                      <b>Instance types by first letter:</b>
                    </div>

                    <InstanceTypeExplanation />
                  </Alert>
                </Col>

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.TagSpecifications"}
                    label="Tags"
                    help_text="Apply tags"
                    choices={[
                      {
                        label: "Tag",
                        name: "tag",
                        value: ["", ""],
                        multiple: true,
                      },
                    ]}
                  >
                    {
                      props.form.get("parameters.TagSpecifications").map((value, index) => {
                        return (
                          <WidgetRow
                            key={value.__uniq}
                            index={index}
                            form={props.form}
                            path={"parameters.TagSpecifications"}
                          >
                            {
                              value.name == "tag" ? (
                                <DualTextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.TagSpecifications[${index}].value`}
                                  prefix1="Key"
                                  prefix2="Value"
                                  placeholder={"Type a tag key"}
                                  placeholder2={"Type a tag value"}
                                  help_text1={"Apply tags to the created instance."}
                                  className="mb-0"
                                ></DualTextInput>
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

            <Tab.Pane eventKey="network">
              <Row>
                <Col sm={6}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.SubnetId"}
                    editable={true}
                    multi={false}
                    label={"Subnet ID"}
                    help_text={"The ID of the subnet to launch the instance into."}
                    placeholder={"Select or type a subnet ID"}
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
                        }).run({ id: `${props.node.id}-parameters.SubnetId` });
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

                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._publicIp"}
                    label={"Assign a public IP"}
                    placeholder={"Assign a public IP"}
                    help_text={"A public IP address can be assigned to the instance during it's creation."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: [
                            {
                              type: "value",
                              label: "Yes",
                              value: "yes",
                            },
                            {
                              type: "value",
                              label: "No",
                              value: "no",
                            },
                            {
                              type: "value",
                              label: "Default subnet behaviour",
                              value: "default",
                            },
                          ],
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>

                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.SecurityGroupIds"}
                    editable={true}
                    multi={true}
                    label={"Security group ID(s)"}
                    help_text={"The IDs of the security group to attach to the instance."}
                    placeholder={"Select or type a security group ID"}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.security_groups,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new SecurityGroupAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.SecurityGroupIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          security_groups_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>

                {
                  // Ipv6AddressCount - The number of IPv6 addresses to associate with the primary network interface.
                  // Ipv6Addresses - The IPv6 addresses from the range of the subnet to associate with the primary network interface.
                  // NetworkInterfaces - The network interfaces to associate with the instance.
                  // PrivateIpAddress - The primary IPv4 address.
                }
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="storage">
              <VolumeTypeSizeSettings {...props} />

              <Row>
                <Col sm={6}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._EbsDeleteOnTermination"}
                    label={"Delete on termination"}
                    help_text={"Choose whether to automatically delete this volume when the instance is terminated"}
                  ></CheckboxInput>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        <AdvancedSettings>
          <Waiters
            {...props} // form, validations
            toggle_help_text="Don't wait for the several instance states to be fulfilled"
            dropdown_help_text="The state(s) which the instance should reach before allowing the execution to continue"
            options={[
              {
                type: "value",
                label: "Wait until instance exists",
                value: "WaitUntilInstanceExists",
              },
              {
                type: "value",
                label: "Wait until instance is running",
                value: "WaitUntilInstanceRunning",
              },
              {
                type: "value",
                label: "Wait until instance has status OK",
                value: "WaitUntilInstanceStatusOk",
              },
            ]}
          />

          <MaxRetries className="mb-0" {...props} />
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Created EC2"}
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
