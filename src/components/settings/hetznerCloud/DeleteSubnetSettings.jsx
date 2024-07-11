import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { useDeepUnorderedCompareState } from "@src/utils/react/useDeepUnorderedCompareState";

const networks_filters = { type: "hetznerCloud:network" };

export const DeleteSubnetSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),
  }));

  const [subnets, setSubnets] = useDeepUnorderedCompareState([]);

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Delete subnet</WHeader>

      <WBody>
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
                    data: subnets[props.form.get("parameters.NetworkIds")[0]] || [],
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                }
              ]}
            ></DropdownInput>
          </Col>
        </Row>

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
