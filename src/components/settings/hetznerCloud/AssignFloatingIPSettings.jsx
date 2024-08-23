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

import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { FloatingIPAutocompleter } from "@src/components/autocompleters/hetznerCloud/FloatingIPAutocompleter";
import { ServerAutocompleter } from "@src/components/autocompleters/hetznerCloud/ServerAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

const floating_ip_filters = { type: "hetznerCloud:floating_ip" };
const servers_filters = { type: "hetznerCloud:server" };

export const AssignFloatingIPSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    servers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...servers_filters })
    ),

    floating_ips: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...floating_ip_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner Cloud - Assign floating IP</WHeader>

      <WBody>
        <Row>
          <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.FloatingIpIds"}
              label={"Floating IP ID"}
              help_text={"Select or type a floating IP ID."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: dqlResults.floating_ips,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new FloatingIPAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.FloatingIpIds` });
                },
              ]}
              notifications={
                <>
                  <VariablesTags expected_vars_filter={[
                    floating_ip_filters,
                  ]} />
                  <CliConnectivity />
                </>
              }
            ></DropdownInput>

            <AnimatedArrow direction="right" className="mx-3 mt-5" />

            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.ServerIds"}
              label={"Server ID"}
              help_text={"Select or type a server ID."}
              editable={true}
              multi={false}
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
                  }).run({ id: `${props.node.id}-parameters.ServerIds` });
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
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the floating IP to get assigned"
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
