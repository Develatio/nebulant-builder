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
import { ServerAutocompleter } from "@src/components/autocompleters/hetznerCloud/ServerAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { useDeepCompareState } from "@src/utils/react/useDeepCompareState";

const servers_filters = { type: "hetznerCloud:server" };
const networks_filters = { type: "hetznerCloud:network" };

export const DetachServerFromNetworkSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    servers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...servers_filters })
    ),

    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),
  }));

  // We need this because we need to know which network zone we should use to
  // filter the "Network ID" dropdown.
  const [servers, setServers] = useDeepCompareState({});

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Detach server from network</WHeader>

      <WBody>
        <Row>
          <Col sm={12} className="grid-split-1fr-1fr align-items-start">
           <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.ServerIds"}
              label={"Server ID"}
              help_text={"Select or type a server ID. At least 1 subnet must exist in the network."}
              editable={true}
              multi={false}
              onChange={_ => {
                props.form.set("parameters.NetworkIds", []);
              }}
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
                  }).run({ id: `${props.node.id}-parameters.ServerIds` }).then(x => {
                    if(!x.rawdata) return x;

                    const servers = x.rawdata.servers.reduce((acc, server) => {
                      acc[server.id] = server.datacenter.location.network_zone;
                      return acc;
                    }, {});
                    setServers(servers);

                    return x;
                  });
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
                  }).run({ id: `${props.node.id}-parameters.NetworkIds` }).then(x => {
                    const server = props.form.get("parameters.ServerIds")[0];
                    const network_zone = servers[server];

                    // Filter networks that are inside the selected location
                    if(!network_zone) return x;

                    const networks = x.rawdata?.networks?.filter?.(
                      // We want to get all networks that have at least one
                      // subnet and it's in the network_zone network zone or
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

        <AdvancedSettings>
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the server to get detached from the network"
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
