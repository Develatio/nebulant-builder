import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
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
import { ServerAutocompleter } from "@src/components/autocompleters/hetznerCloud/ServerAutocompleter";
import { NetworkAutocompleter } from "@src/components/autocompleters/hetznerCloud/NetworkAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

const servers_filters = { type: "hetznerCloud:server" };
const networks_filters = { type: "hetznerCloud:network" };

export const AddRouteToNetworkSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    servers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...servers_filters })
    ),

    networks: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...networks_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Add route to network</WHeader>

      <WBody>
        <Row>
          <Col sm={12}>
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

          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Destination"}
              label={"Destination"}
              placeholder={"Enter a destination"}
              help_text={"The destination network"}
            ></TextInput>
          </Col>

          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Gateway"}
              label={"Gateway"}
              help_text={"Select or type a gateway."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: dqlResults.servers,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run().then(x => {
                    const servers = x.data.map(server => ({
                      type: "value",
                      label: `{{ ${server.rawValue}.server.private_net[0].ip }}`,
                      value: `{{ ${server.rawValue}.server.private_net[0].ip }}`,
                    }));

                    return {
                      ...x,
                      data: servers,
                    }
                  });
                },
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new ServerAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.Gateway` }).then(x => {
                    const servers = (x?.rawdata?.servers || []).reduce((acc, server) => {
                      const privIps = server.private_net.map(iface => ({
                        type: "value",
                        label: `${iface.ip} (${server.name})`,
                        value: iface.ip,
                      }));
                      return acc.concat(privIps);
                    }, []);

                    return {
                      ...x,
                      data: servers,
                    };
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
