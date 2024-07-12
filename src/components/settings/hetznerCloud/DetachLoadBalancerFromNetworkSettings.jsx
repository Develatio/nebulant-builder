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
import { LoadBalancerAutocompleter } from "@src/components/autocompleters/hetznerCloud/LoadBalancerAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

const load_balancers_filters = { type: "hetznerCloud:load_balancer" };

export const DetachLoadBalancerFromNetworkSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    load_balancers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...load_balancers_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Detach load balancer from network</WHeader>

      <WBody>
        <Row>
          <Col sm={12} className="grid-split-1fr-1fr">
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.LoadBalancerIds"}
              label={"Load balancer ID"}
              help_text={"Detach load balancer from a network by it's ID."}
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

            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.NetworkIds"}
              label={"Network ID"}
              help_text={"Select or type the ID of the network to which is the load balancer is attached."}
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
                  return new NetworkAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.NetworkIds` });
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
          </Col>
        </Row>

        <AdvancedSettings>
          <Waiters {...props} />

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
