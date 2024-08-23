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
import { LoadBalancerAutocompleter } from "@src/components/autocompleters/hetznerCloud/LoadBalancerAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { useDeepUnorderedCompareState } from "@src/utils/react/useDeepUnorderedCompareState";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

const load_balancers_filters = { type: "hetznerCloud:load_balancer" };
const networks_filters = { type: "hetznerCloud:network" };

export const AttachLoadBalancerToNetworkSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),

    load_balancers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...load_balancers_filters })
    ),
  }));

  const [subnets, setSubnets] = useDeepUnorderedCompareState([]);

  return (
    <Container>
      <WHeader help={props.help}>Hetzner Cloud - Attach load balancer to network</WHeader>

      <WBody>

        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "auto")} eventKey="auto">Auto-assign IP in a subnet</Nav.Link>
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "manual")} eventKey="manual">Manual IP</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

            <Tab.Content className="pt-3 border-0">
              <Tab.Pane eventKey="auto">
                <Row className="my-3">
                  <Col sm={12} className="grid-split-1fr-auto-2fr align-items-start">
                    <DropdownInput
                      node={props.node}
                      form={props.form}
                      validations={props.validations}
                      path={"parameters.LoadBalancerIds"}
                      label={"Load balancer ID"}
                      help_text={"Select or type a load balancer ID."}
                      editable={true}
                      multi={false}
                      options={[
                        ({ searchPattern, page, perPage, group, pagingDetails }) => {
                          return new StaticAutocompleter({
                            data: dqlResults.load_balancers,
                            filters: { searchPattern, page, perPage, group, pagingDetails },
                          }).run();
                        },
                        ({ searchPattern, page, perPage, group, pagingDetails }) => {
                          return new LoadBalancerAutocompleter({
                            node: props.node,
                            filters: { searchPattern, page, perPage, group, pagingDetails },
                          }).run({ id: `${props.node.id}-parameters.LoadBalancerIds` });
                        },
                      ]}
                      notifications={
                        <>
                          <VariablesTags expected_vars_filter={[
                            load_balancers_filters,
                          ]} />
                          <CliConnectivity />
                        </>
                      }
                    ></DropdownInput>

                    <AnimatedArrow direction="right" className="mx-3 mt-5" />

                    <Row>
                      <Col sm={6}>
                        <DropdownInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.NetworkIds"}
                          label={"Network ID"}
                          help_text={"Select or type a network ID."}
                          editable={true}
                          multi={false}
                          onChange={v => {
                            const ranges = subnets[v[0]];
                            if(ranges && ranges.length === 0) {
                              props.form.set("parameters.Subnet", []);
                            } else if(ranges && ranges.length > 0) {
                              props.form.set("parameters.Subnet", [ranges[0].value]);
                            }
                          }}
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
                              }).run({ id: `${props.node.id}-parameters.NetworkIds` }).then(x => {
                                const subnets = (x?.rawdata?.networks || []).reduce((acc, network) => {
                                  acc[network.id] = network.subnets.map(subnet => ({
                                    label: subnet.ip_range,
                                    value: subnet.ip_range,
                                  }));
                                  return acc;
                                }, {});
                                setSubnets(subnets);
                                return x;
                              });
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

                      <Col sm={6}>
                        <DropdownInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={`parameters.Subnet`}
                          label={"Subnet"}
                          help_text={"Select the subnet."}
                          editable={true}
                          multi={false}
                          options={[
                            ({ searchPattern, page, perPage, group, pagingDetails }) => {
                              return new StaticAutocompleter({
                                data: dqlResults.networks,
                                filters: { searchPattern, page, perPage, group, pagingDetails },
                              }).run().then(networks => {
                                return {
                                  ...networks,
                                  data: networks.data.map(network => ({
                                    type: network.type,
                                    label: `{{ ${network.rawValue}.network.subnets[0].ip_range }}`,
                                    value: `{{ ${network.rawValue}.network.subnets[0].ip_range }}`,
                                  })),
                                }
                              });
                            },
                            ({ searchPattern, page, perPage, group, pagingDetails }) => {
                              return new StaticAutocompleter({
                                data: subnets[props.form.get("parameters.NetworkIds")[0]] || [],
                                filters: { searchPattern, page, perPage, group, pagingDetails },
                              }).run();
                            }
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
                  </Col>

                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="manual">
                <Row className="my-3">
                  <Col sm={12} className="grid-split-1fr-auto-2fr align-items-start">
                    <DropdownInput
                      node={props.node}
                      form={props.form}
                      validations={props.validations}
                      path={"parameters.LoadBalancerIds"}
                      label={"Load balancer ID"}
                      help_text={"Select or type a load balancer ID."}
                      editable={true}
                      multi={false}
                      options={[
                        ({ searchPattern, page, perPage, group, pagingDetails }) => {
                          return new StaticAutocompleter({
                            data: dqlResults.load_balancers,
                            filters: { searchPattern, page, perPage, group, pagingDetails },
                          }).run();
                        },
                        ({ searchPattern, page, perPage, group, pagingDetails }) => {
                          return new LoadBalancerAutocompleter({
                            node: props.node,
                            filters: { searchPattern, page, perPage, group, pagingDetails },
                          }).run({ id: `${props.node.id}-parameters.LoadBalancerIds2` });
                        },
                      ]}
                      notifications={
                        <>
                          <VariablesTags expected_vars_filter={[
                            load_balancers_filters,
                          ]} />
                          <CliConnectivity />
                        </>
                      }
                    ></DropdownInput>

                    <AnimatedArrow direction="right" className="mx-3 mt-5" />

                    <Row>
                      <Col sm={6}>
                        <DropdownInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.NetworkIds"}
                          label={"Network ID"}
                          help_text={"Select or type a network ID."}
                          editable={true}
                          multi={false}
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
                              }).run({ id: `${props.node.id}-parameters.NetworkIds2` });
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

                      <Col sm={6}>
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.IP"}
                          label={"IP"}
                          placeholder={"1.2.3.4"}
                          help_text={"Type the static IP"}
                        ></TextInput>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
        </Tab.Container>

        <AdvancedSettings>
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the load balancer to get attached to the network"
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
