import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";

import { SSHConfig } from "@src/components/settings/generic/SSHConfig";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { SSHSourceTarget } from "./SSHSourceTarget";

export const DownloadFilesSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Download Files via SSH</WHeader>

      <WBody>

        <Tab.Container defaultActiveKey="files">

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link eventKey="files">Files</Nav.Link>
                  <Nav.Link eventKey="source">Source machine</Nav.Link>
                  <Nav.Link eventKey="proxies">Proxies</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="files">
              <ArrayOfWidgets
                className="my-3"
                form={props.form}
                validations={props.validations}
                path={"parameters.paths"}
                label="Files / folders"
                help_text="Add files / folders using relative or absolute paths and they'll be transfered."
                add_new_text="Add files / folders"
                choices={[
                  {
                    label: "New path pair",
                    name: "new-path-pair",
                    value: {
                      _src_type: "file",
                      src: "",
                      dest: "",
                      overwrite: false,
                      recursive: true,
                    },
                    multiple: true,
                  },
                ]}
              >
                {
                  props.form.get("parameters.paths").map((variable, index) => {
                    return (
                      <WidgetRow
                        key={variable.__uniq}
                        index={index}
                        itemSize={12}
                        form={props.form}
                        path={"parameters.paths"}
                      >
                        <Row key={index}>
                          <SSHSourceTarget
                            key={index}
                            node={props.node}
                            form={props.form}
                            validations={props.validations}
                            srctype={`parameters.paths[${index}].value._src_type`}
                            overwrite={`parameters.paths[${index}].value.overwrite`}
                            recursive={`parameters.paths[${index}].value.recursive`}
                            src={`parameters.paths[${index}].value.src`}
                            dest={`parameters.paths[${index}].value.dest`}
                          ></SSHSourceTarget>
                        </Row>
                      </WidgetRow>
                    )
                  })
                }
              </ArrayOfWidgets>
            </Tab.Pane>

            <Tab.Pane eventKey="source">
              <Row className="my-3">
                <SSHConfig
                  node={props.node}
                  form={props.form}
                  validations={props.validations}
                  host={"parameters.source"}
                  port={"parameters.port"}
                  username={"parameters.username"}
                  credentials={"parameters._credentials"}
                  privkeyPath={"parameters.privkeyPath"}
                  passphrase={"parameters.passphrase"}
                  privkey={"parameters.privkey"}
                  password={"parameters.password"}
                ></SSHConfig>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="proxies">
              <ArrayOfWidgets
                className="my-3"
                form={props.form}
                validations={props.validations}
                path={"parameters.proxies"}
                label="Proxies"
                help_text="Proxies can be used to reach hosts behind bastions. If multiple proxies are added, the connection will be routed through all of them following their order from top to bottom."
                add_new_text="Add new proxy"
                choices={[
                  {
                    label: "New SSH Config",
                    name: "new-ssh-config",
                    value: {
                      _credentials: "privkeyPath",
                      target: [],
                      username: "",
                      privkeyPath: "",
                      privkey: "",
                      passphrase: "",
                      password: "",
                      port: 22,
                    },
                    multiple: true,
                  },
                ]}
              >
                {
                  props.form.get("parameters.proxies").map((variable, index) => {
                    return (
                      <WidgetRow
                        key={variable.__uniq}
                        index={index}
                        itemSize={12}
                        form={props.form}
                        path={"parameters.proxies"}
                        dnd={true}
                        rearrangeElements={(dragIndex, hoverIndex) => {
                          const proxies = props.form.get("parameters.proxies");
                          const tmp = proxies[dragIndex];
                          proxies.splice(dragIndex, 1);
                          proxies.splice(hoverIndex, 0, tmp);
                          props.form.set("parameters.proxies", proxies);
                        }}
                      >
                        <Row key={index}>
                          <SSHConfig
                            key={index}
                            node={props.node}
                            form={props.form}
                            validations={props.validations}
                            host={`parameters.proxies[${index}].value.target`}
                            port={`parameters.proxies[${index}].value.port`}
                            username={`parameters.proxies[${index}].value.username`}
                            credentials={`parameters.proxies[${index}].value._credentials`}
                            privkeyPath={`parameters.proxies[${index}].value.privkeyPath`}
                            passphrase={`parameters.proxies[${index}].value.passphrase`}
                            privkey={`parameters.proxies[${index}].value.privkey`}
                            password={`parameters.proxies[${index}].value.password`}
                          ></SSHConfig>
                        </Row>
                      </WidgetRow>
                    )
                  })
                }
              </ArrayOfWidgets>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        <AdvancedSettings>
          <MaxRetries className="mb-0" {...props} />
        </AdvancedSettings>
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
