import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";
import { NetworkZoneAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkZoneAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { useDeepUnorderedCompareState } from "@src/utils/react/useDeepUnorderedCompareState";

import { IPCalculator } from "@src/components/settings/hetznerCloud/_IPCalculator";

const networks_filters = { type: "hetznerCloud:network" };

export const CreateSubnetSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),
  }));

  const [netranges, setNetranges] = useDeepUnorderedCompareState([]);
  const [networks, setNetworks] = useDeepUnorderedCompareState([]);

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Create subnet</WHeader>

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
                v = v[0];

                if(netranges[v]) {
                  props.form.set("parameters.IPRange", netranges[v]);
                }

                // We're doing this to prevent the user from shooting oneself in
                // the foot. If the user has selected a Network ID, we try to
                // figure out if that Network ID has any subnets, and if it does
                // we preselect the network zone of the subnets and disable the
                // dropdown.
                const network = networks.find(n => `${n.id}` === v);
                const [nz] = [...new Set(network?.subnets?.map?.(s => s.network_zone))];
                if(nz) {
                  props.form.set("parameters.NetworkZone", [nz]);
                } else {
                  props.form.set("parameters.NetworkZone", []);
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
                    const networks = x?.rawdata?.networks || [];
                    const netranges = networks.reduce((acc, network) => {
                      acc[network.id] = network.ip_range;
                      return acc;
                    }, {});
                    setNetranges(netranges);
                    setNetworks(networks);
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
              path={"parameters.NetworkZone"}
              label={"Network zone"}
              help_text={"The network zone in which the network will be created."}
              editable={true}
              multi={false}
              disabled={
                // We want to disable this dropdown if
                // "Network ID" hasn't been selected
                // OR
                // if it has been selected, but there are no subnets in it
                !props.form.get("parameters.NetworkIds").length ||
                (
                  props.form.get("parameters.NetworkIds").length &&
                  networks.find(n => `${n.id}` === props.form.get("parameters.NetworkIds")[0])?.subnets?.length
                )
              }
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new NetworkZoneAutocompleter({
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>

          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.IPRange"}
              label={"IP range"}
              placeholder={"Type an ip range, for example: 172.16.0.0/24"}
              help_text={"The ip range that will be used to created the subnet."}
            ></TextInput>
          </Col>

          <Col sm={6}>
            <FormLabel>{"\u00A0"}</FormLabel>

            <IPCalculator addressmask={props.form.get("parameters.IPRange")} />
          </Col>
        </Row>

        <AdvancedSettings>
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the subnet to get created"
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
