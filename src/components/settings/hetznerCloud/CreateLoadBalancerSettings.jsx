import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
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
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";
import { LocationAutocompleter } from "@src/components/autocompleters/hetznerCloud/LocationAutocompleter";
import { LoadBalancerTypeAutocompleter } from "@src/components/autocompleters/hetznerCloud/LoadBalancerTypeAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

const networks_filters = { type: "hetznerCloud:network" };

export const CreateLoadBalancerSettings = (props) => {
  const locations = usePromiseValue((new LocationAutocompleter({
    filters: { perPage: Infinity },
  })).run(), {});

  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Create load balancer</WHeader>

      <WBody>
        <Row className="my-3">
          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Name"}
              label={"Name"}
              placeholder={"Type a name"}
              help_text={"The name that will be assigned to the load balancer."}
            ></TextInput>
          </Col>

          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.LoadBalancerTypes"}
              label={"Load balancer type"}
              help_text={"Select a type"}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new LoadBalancerTypeAutocompleter({
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>
        </Row>

        <Row className="my-3">
          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Locations"}
              label={"Location"}
              help_text={"The location in which the load balancer will be created."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: locations?.data || [],
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>

          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.NetworkIds"}
              label={"Network ID"}
              help_text={"Select or type a network ID. At least 1 subnet must exist in the network."}
              editable={true}
              multi={false}
              disabled={!props.form.get("parameters.Locations").length}
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
                    const location = props.form.get("parameters.Locations")[0];
                    const { network_zone } = locations?.rawdata?.find?.(l => l.name === location) || {};

                    // Filter networks that are inside the selected location
                    if(!network_zone) return x;

                    const networks = x.rawdata?.networks?.filter?.(
                      // We want to get all networks that have at least
                      // one subnet in the network_zone network zone or
                      // networks without subnets
                      network => !network.subnets.length || network.subnets.some(
                        subnet => subnet.network_zone === network_zone
                      )
                    ) || [];

                    const nids = networks.map(n => `${n.id}`);

                    if(!nids.length) return { ...x, data: [] };

                    return {
                      ...x,
                      data: x.data.filter(n => nids.includes(n.value)),
                    };
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
        </Row>

        <Row className="my-3">
          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Algorithms"}
              label={"Algorithm"}
              help_text={"The balancing algorithm that should be used"}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: [
                      { label: "Round robin", value: "round_robin" },
                      { label: "Least connections", value: "least_connections", selected: true },
                    ],
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>

          <Col sm={6}>
            <CheckboxInput
              form={props.form}
              validations={props.validations}
              path={`parameters.PublicInterface`}
              label={"Public interface"}
              help_text={"Make the load balancer accessible from the internet."}
            ></CheckboxInput>
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
                        help_text1={"Add labels to the created load balancer."}
                        className="mb-0"
                      ></DualTextInput>
                    )
                  }
                </WidgetRow>
              )
            })
          }
        </ArrayOfWidgets>

        <AdvancedSettings>
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the load balancer to get created"
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
