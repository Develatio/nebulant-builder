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

import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { VolumeAutocompleter } from "@src/components/autocompleters/aws/VolumeAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

const volumes_filters = { type: "aws:volume" };
const instances_filters = { type: "aws:instance" };

export const DetachVolumeSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    volumes: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...volumes_filters })
    ),

    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Detach Volume</WHeader>

      <WBody>
        <Row>
          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.VolumeId"}
              label={"Volume ID"}
              help_text={"Detach a volume by it's ID."}
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

            <CheckboxInput
              form={props.form}
              validations={props.validations}
              path={"parameters.Force"}
              label={"Force detachment"}
              help_text={"Forces detachment if the previous detachment attempt did not occur cleanly."}
            ></CheckboxInput>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <CheckboxInput
              form={props.form}
              validations={props.validations}
              path={"parameters._MultiAttached"}
              label={"Multi-Attached Volume"}
              help_text={"If you are detaching a Multi-Attach enabled volume, you must specify an instance ID."}
            ></CheckboxInput>
          </Col>

          <Col sm={6}>
            {
              props.form.get("parameters._MultiAttached") ? (
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
              ) : ""
            }
          </Col>
        </Row>

        <AdvancedSettings>
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
