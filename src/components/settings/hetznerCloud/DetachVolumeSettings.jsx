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
import { VolumeAutocompleter } from "@src/components/autocompleters/hetznerCloud/VolumeAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

const volumes_filters = { type: "hetznerCloud:volume" };

export const DetachVolumeSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    volumes: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...volumes_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Detach volume</WHeader>

      <WBody>
        <Row>
          <Col sm={12}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.VolumeIds"}
              label={"Volume ID"}
              help_text={"Detach a volume by it's ID."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: dqlResults.volumes,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new VolumeAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.VolumeIds` });
                },
              ]}
              notifications={
                <>
                  <VariablesTags expected_vars_filter={[
                    volumes_filters,
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
