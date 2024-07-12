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

import { VolumeAutocompleter } from "@src/components/autocompleters/aws/VolumeAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

const volumes_filters = { type: "aws:volume" };

export const DeleteVolumeSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    volumes: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...volumes_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Delete volume</WHeader>

      <WBody>
        <Row>
          <Col sm={12}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.VolumeId"}
              label={"Volume ID"}
              help_text={"Delete a volume by it's ID."}
              editable={true}
              multi={false}
              groups={regions?.data}
              groupsDisallowUnselect={true}
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
                  }).run({ id: `${props.node.id}-parameters.VolumeId` });
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
          <Waiters
            {...props} // form, validations
            toggle_help_text="Don't wait for the volume to be fully deleted"
            dropdown_help_text="The state(s) which the volume should reach before allowing the execution to continue"
            options={[
              {
                type: "value",
                label: "Wait until volume has been deleted",
                value: "WaitUntilVolumeDeleted",
              },
            ]}
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
