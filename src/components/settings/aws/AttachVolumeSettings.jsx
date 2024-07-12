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

import { TextInput } from "@src/ui/functionality/TextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { VolumeAutocompleter } from "@src/components/autocompleters/aws/VolumeAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { AnimatedArrow } from "@src/ui/visual/AnimatedArrow";

const volumes_filters = { type: "aws:volume" };
const instances_filters = { type: "aws:instance" };

export const AttachVolumeSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),

    volumes: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...volumes_filters })
    ),
  }));

  return (
    <Container className="aws_attach_ebs_settings">
      <WHeader help={props.help}>AWS - Attach volume</WHeader>

      <WBody>
        <Row>
          <Col sm={12} className="d-flex align-items-start device">
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Device"}
              label={"Device"}
              placeholder={"Type the device name"}
              help_text={"The device name (for example, /dev/sdh or xvda)."}
            ></TextInput>
          </Col>

          <Col sm={12} className="grid-split-1fr-auto-1fr align-items-start">
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.VolumeId"}
              label={"Volume ID"}
              help_text={"Select or type a volume ID."}
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

            <AnimatedArrow direction="right" className="mx-3 mt-5" />

            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.InstanceId"}
              label={"Instance ID"}
              help_text={"Select or type an instance ID."}
              editable={true}
              multi={false}
              groups={regions?.data}
              groupsDisallowUnselect={true}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: dqlResults.instances,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new InstanceAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.InstanceId` });
                },
              ]}
              notifications={
                <>
                  <VariablesTags expected_vars_filter={[
                    instances_filters,
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
            toggle_help_text="Don't wait for the several volume states to be fulfilled"
            dropdown_help_text="The state(s) which the volume should reach before allowing the execution to continue"
            options={[
              {
                type: "value",
                label: "Wait until volume is in use",
                value: "WaitUntilVolumeInUse",
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
