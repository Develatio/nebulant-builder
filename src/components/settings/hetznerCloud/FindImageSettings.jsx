import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { Paging } from "@src/components/settings/hetznerCloud/_Paging";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { TextInput } from "@src/ui/functionality/TextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { ImageAutocompleter } from "@src/components/autocompleters/hetznerCloud/ImageAutocompleter";
import { HetznerImageAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerImageAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

import { LabelSelectorTooltip } from "@src/components/settings/hetznerCloud/_LabelSelectorTooltip";

const images_filters = { type: "hetznerCloud:image" };

export const FindImageSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    images: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...images_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Find image</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-image" ? (
                      <>
                        <Nav.Link onClick={() => props.form.set("parameters._activeTab", "id")} eventKey="id">Find by ID</Nav.Link>
                        <Nav.Link onClick={() => props.form.set("parameters._activeTab", "hetzner_images")} eventKey="hetzner_images">Hetzner images</Nav.Link>
                      </>
                    ) : ""
                  }
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="filters">
              <Row className="my-3">
                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Description"}
                    label={"Description"}
                    placeholder={"Type a description"}
                    help_text={"The description of the image (provided during image creation)."}
                  ></TextInput>
                </Col>

                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Name"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name of the image (only for Hetzner's own images)."}
                  ></TextInput>
                </Col>

                {
                  <Col sm={12} className="d-flex flex-column">
                    <Alert variant="info" className="py-1 small">
                      It's worth noting that Hetzner's panel might be confusing. Snapshots and backups can't be
                      assigned a <b>Name</b>, only a <b>Description</b>. <br />
                      The <b>Name</b> field is reserved only for <code>system</code> and <code>app</code> images (Hetzner's own images). <br/>
                      If you want to search <code>system</code> or <code>app</code> images, feel free to use the <b>Name</b> field.
                      Otherwise use the <b>Description</b> field. <br/>
                      Keep in mind that searching by <b>Description</b> will require fetching all images and filtering locally since
                      Hetzner API doesn't support server-side filtering by <b>Description</b>.
                    </Alert>
                  </Col>
                }

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Filters"}
                    label="Filters"
                    help_text="Narrow down the search further by applying filters. Logical operator AND will be used if more than one filter is selected. If more than one value for each filter is selected, logical operator OR will be applied between each value (where applicable)."
                    choices={[
                      {
                        label: "Architecture",
                        name: "Architecture",
                        value: [],
                      },
                      {
                        label: "Label",
                        name: "LabelSelector",
                        value: "",
                      },
                      {
                        label: "Type",
                        name: "Type",
                        value: ["snapshot", "backup"],
                      },
                      {
                        label: "Status",
                        name: "Status",
                        value: ["available"],
                      },
                    ]}
                  >
                    {
                      props.form.get("parameters.Filters").map((value, index) => {
                        return (
                          <WidgetRow
                            key={value.__uniq}
                            index={index}
                            form={props.form}
                            path={"parameters.Filters"}
                          >
                            {
                              value.name == "Architecture" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Architecture"}
                                  help_text={"The architecture of the image."}
                                  placeholder={"Select an architecture"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: [
                                          { label: "x86", value: "x86" },
                                          { label: "ARM", value: "arm" },
                                        ],
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "LabelSelector" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Label filter"}
                                  placeholder={"Type a label filter expression"}
                                  help_text={
                                    <>
                                      A
                                      <Tooltip
                                        maxWidth={450}
                                        placement="right"
                                        label={<LabelSelectorTooltip />}
                                      >
                                        <span className="text-decoration-underline mx-1">label filter expression</span>
                                      </Tooltip>
                                      that will be used to perform the filtering.
                                    </>
                                  }
                                ></TextInput>
                              ) : value.name == "Type" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Type"}
                                  help_text={"The type of the image."}
                                  placeholder={"Select one or more types"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: [
                                          { label: "Snapshots", value: "snapshot" },
                                          { label: "Backups", value: "backup" },
                                          { label: "Base OS images (system)", value: "system" },
                                          { label: "Applications", value: "app" },
                                        ],
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "Status" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Status"}
                                  help_text={"The status of the image."}
                                  placeholder={"Select one or more status"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: [
                                          { label: "Available", value: "available" },
                                          { label: "Creating", value: "creating" },
                                        ],
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : ""
                            }
                          </WidgetRow>
                        )
                      })
                    }
                  </ArrayOfWidgets>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="id">
              <Row className="my-3">
                <Col sm={12}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ImageID"}
                    label={"Image ID"}
                    help_text={"Filter by specific ID."}
                    searchPattern=""
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.images || [],
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new ImageAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                    notifications={
                      <>
                      <VariablesTags expected_vars_filter={[
                        images_filters,
                      ]} />
                      <CliConnectivity />
                    </>
                    }
                  ></DropdownInput>
                </Col>

                <Col sm={12} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>
                  {/*
                  <AmiDetails amiid={props.form.get("parameters.ImageID")[0]} />
                  */}
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="hetzner_images">
              <Row className="my-3">
                <Col sm={12}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.HetznerImageID"}
                    label={"Image ID"}
                    help_text={"Filter by specific ID."}
                    multi={false}
                    groups={[
                      { label: "Base OS images", value: "sysimages", selected: true },
                      { label: "Applications images", value: "appimages" },
                    ]}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new HetznerImageAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>
                </Col>

                <Col sm={12} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>
                  {/*
                  <AmiDetails amiid={props.form.get("parameters.HetznerImageID")[0]} />
                  */}
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          {
            props.node.prop("data/id") === "find-images" ? (
              <Paging {...props} />
            ) : ""
          }
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
