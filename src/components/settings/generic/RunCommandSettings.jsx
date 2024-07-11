import { useState } from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Alert from "react-bootstrap/esm/Alert";

import Container from "react-bootstrap/esm/Container";

import { SSHConfig } from "@src/components/settings/generic/SSHConfig";

import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { CodeEditor, highlight } from "@src/ui/functionality/CodeEditor";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

export const RunCommandSettings = (props) => {
  const [matchedLanguage, setMatchedLanguage] = useState("");

  const vars = props.form.get("parameters.vars");

  return (
    <Container>
      <WHeader help={props.help}>Run command settings</WHeader>

      <WBody>

        <Tab.Container defaultActiveKey="command_settings">

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link eventKey="command_settings">Command settings</Nav.Link>
                  <Nav.Link eventKey="target">Target</Nav.Link>
                  <Nav.Link eventKey="proxies">Proxies</Nav.Link>
                  <Nav.Link eventKey="debug">Debug</Nav.Link>
                  <Nav.Link eventKey="env_vars">Expose variables to environment</Nav.Link>
                  <Nav.Link eventKey="dump_vars">Dump variables to JSON</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="command_settings">
              <Row className="my-3">
                <Col sm={5}>
                  <SimpleDropdownInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._type"}
                    label={"Type"}
                    help_text={"Select what you'd like to run."}
                    options={[
                      { label: "Command", value: "command" },
                      { label: "Embedded script", value: "script" },
                    ]}
                  ></SimpleDropdownInput>
                </Col>

                <Col sm={3}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._custom_entrypoint"}
                    label={"Advanced mode"}
                    help_text={"Set a custom entrypoint instead of using the default shell."}
                  ></CheckboxInput>
                </Col>

                {
                  props.form.get("parameters._type") == "script" &&
                  props.form.get("parameters._custom_entrypoint") ? (
                    <Col sm={4}>
                      <CheckboxInput
                        form={props.form}
                        validations={props.validations}
                        path={"parameters.pass_to_entrypoint_as_single_param"}
                        label={"Entrypoint expects one parameter"}
                        help_text={"Pass everything to the entrypoint as a single parameter."}
                      ></CheckboxInput>
                    </Col>
                  ) : (
                    <Col sm={4}></Col>
                  )
                }

                {
                  props.form.get("parameters._type") == "command" && (
                    <>
                      {
                        props.form.get("parameters._custom_entrypoint") && (
                          <Col sm={4}>
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={"parameters.entrypoint"}
                              label={"Entrypoint"}
                              placeholder={""}
                              help_text={"Let the OS know how to run your command (\"bash -c\", \"cmd /c\"...)"}
                            ></TextInput>
                          </Col>
                        )
                      }

                      <Col sm={props.form.get("parameters._custom_entrypoint") ? 8 : 12}>
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.command"}
                          label={"Command"}
                          placeholder={"sudo foo && bar"}
                          help_text={`
                            Write the command you want to be executed. This can also be a path to an executable file (
                            absolute or relative to the nebulant binary), such as a script or a binary.
                          `}
                        ></TextInput>
                      </Col>
                    </>
                  )
                }

                {
                  props.form.get("parameters._type") == "script" && (
                    <>
                      <Col sm={12}>
                        <CodeEditor
                          node={props.node}
                          form={props.form}
                          path={"parameters.script"}
                          highlight={code => {
                            const parsed = highlight(code);
                            const highlighted = parsed.value;

                            setTimeout(() => setMatchedLanguage(parsed.language));

                            return highlighted.split("\n").map((line, i) => (
                              `<span class='editorLineNumber'>${i + 1}</span>${line}`
                            )).join("\n");
                          }}
                          preClassName={"language-bash"}
                          placeholder={"#!/bin/bash"}
                        />

                        {
                          (
                            !props.form.get("parameters.scriptName") &&
                            matchedLanguage == "dos"
                          ) ? (
                            <Alert variant="info" className="mt-n3 py-1 small">
                              This looks like a <b>DOS</b> file. We suggest you to <Alert.Link onClick={() => {
                                props.form.set("parameters.scriptName", "script.bat");
                              }}>set the file extension to ".bat"</Alert.Link>.
                            </Alert>
                          ) : (
                            !props.form.get("parameters.scriptName") &&
                            matchedLanguage == "powershell"
                          ) ? (
                            <Alert variant="info" className="mt-n3 py-1 small">
                              This looks like a <b>PowerShell</b> file. We suggest you to <Alert.Link onClick={() => {
                                props.form.set("parameters.scriptName", "script.ps1");
                              }}>set the file extension to ".ps1"</Alert.Link>.
                            </Alert>
                          ) : ""
                        }
                      </Col>

                      {
                        props.form.get("parameters._custom_entrypoint") && (
                          <Col sm={3}>
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={"parameters.entrypoint"}
                              label={"Entrypoint"}
                              placeholder={""}
                              help_text={"Tell the OS how to run your command (\"bash -c\", \"cmd /c\"...)"}
                            ></TextInput>
                          </Col>
                        )
                      }

                      <Col
                        sm={props.form.get("parameters._custom_entrypoint") ? 4 : 6}
                        className={props.form.get("parameters.pass_to_entrypoint_as_single_param") ? "pass_to_entrypoint_as_single_param scriptName pe-0" : ""}
                      >
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.scriptName"}
                          label={"File name / extension"}
                          placeholder={"my_script.bat"}
                          help_text={`
                            If your OS depends on the file extension to decide how to execute your script (namely
                            Windows), use this field to set a name and extension.
                          `}
                        ></TextInput>
                      </Col>

                      <Col
                        sm={props.form.get("parameters._custom_entrypoint") ? 5 : 6}
                        className={props.form.get("parameters.pass_to_entrypoint_as_single_param") ? "pass_to_entrypoint_as_single_param scriptParameters ps-0" : ""}
                      >
                        <TextInput
                          node={props.node}
                          form={props.form}
                          validations={props.validations}
                          path={"parameters.scriptParameters"}
                          label={"Embedded script parameters"}
                          placeholder={"--foo 42 --bar 'hello world!'"}
                          help_text={"Type here any parameters you might want to pass to the embedded script."}
                        ></TextInput>
                      </Col>
                    </>
                  )
                }
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="target">
              <Row className="my-3">
                <Col sm={6}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._run_on_remote"}
                    label={"Run on a remote machine"}
                    help_text={"Run the commands on a remote machine via SSH"}
                  ></CheckboxInput>
                </Col>

                <Col sm={6}>
                  <Alert variant="info" className="py-1 small">
                    Connecting to a remote server requires <code>AllowTcpForwarding all</code> in the <b>sshd_config</b>.
                  </Alert>
                </Col>

                {
                  props.form.get("parameters._run_on_remote") && (
                    <SSHConfig
                      node={props.node}
                      form={props.form}
                      validations={props.validations}
                      host={"parameters.target"}
                      port={"parameters.port"}
                      username={"parameters.username"}
                      credentials={"parameters._credentials"}
                      privkeyPath={"parameters.privkeyPath"}
                      passphrase={"parameters.passphrase"}
                      privkey={"parameters.privkey"}
                      password={"parameters.password"}
                    ></SSHConfig>
                  )
                }

              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="proxies">
              {
                props.form.get("parameters._run_on_remote") ? (
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
                ) : (
                  <Row>
                    <Col sm={12}>
                      <Alert variant="info" className="py-2 small">
                        Proxies can't be enabled if the target is not a remote machine
                      </Alert>
                    </Col>
                  </Row>
                )
              }
            </Tab.Pane>

            <Tab.Pane eventKey="debug">
              <Row className="my-3">
                <Col sm={12}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.open_dbg_shell_before"}
                    label={"Open debug shell before running the command"}
                    help_text={"Pause the Nebulant CLI before running the command and open an interactive shell (connected to the remote machine, if applicable)"}
                  ></CheckboxInput>
                </Col>

                <Col sm={12}><hr /></Col>

                <Col sm={12}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.open_dbg_shell_after"}
                    label={"Open debug shell after running the command"}
                    help_text={"Pause the Nebulant CLI after running the command and open an interactive shell (connected to the remote machine, if applicable)"}
                  ></CheckboxInput>
                </Col>

                <Col sm={12}><hr /></Col>

                <Col sm={12}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.open_dbg_shell_onerror"}
                    label={"Open debug shell if the command fails"}
                    help_text={"Pause the Nebulant CLI if the command fails and open an interactive shell (connected to the remote machine, if applicable)"}
                  ></CheckboxInput>
                </Col>

                <Col sm={12}><hr /></Col>

                <Col sm={12}>
                  <Alert variant="info" className="py-2 small">
                    Keep in mind that these options require the Nebulant CLI to be running in an interactive TTY.
                    If no interactive TTY is found (E.g. you're running the Nebulant CLI in a CI/CD pipeline), you'll be
                    offered to proceed with the debugging from a web-based shell (if supported by your organization's plan).
                  </Alert>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="env_vars">
              <ArrayOfWidgets
                className="my-3"
                form={props.form}
                validations={props.validations}
                path={"parameters.vars"}
                label="Environment variables"
                help_text="Expose environment variables"
                add_new_text="Add new environment variable"
                choices={[
                  {
                    label: "New environment variable",
                    name: "new-environment-variable",
                    value: {
                      name: "",
                      value: "",
                    },
                    multiple: true,
                  },
                ]}
              >

                {
                  vars.map((variable, index) => {
                    return (
                      <WidgetRow
                        key={variable.__uniq}
                        index={index}
                        itemSize={12}
                        form={props.form}
                        path={"parameters.vars"}
                      >
                        <Row key={index}>
                          <Col sm={4}>
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`parameters.vars[${index}].value.name`}
                              label={"Name"}
                              placeholder={"Type an environment variable name"}
                              help_text={"The name of the environment variable."}
                            ></TextInput>
                          </Col>
                          <Col sm={8}>
                            <TextInput
                              as="textarea"
                              rows="1"
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`parameters.vars[${index}].value.value`}
                              label={"Value"}
                              placeholder={"Type the value of the environment variable"}
                              help_text={"The value of the environment variable."}
                            ></TextInput>
                          </Col>
                        </Row>
                      </WidgetRow>
                    )
                  })
                }
              </ArrayOfWidgets>
            </Tab.Pane>

            <Tab.Pane eventKey="dump_vars">
              <Row className="my-3">
                <Col sm={6}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.dump_json"}
                    label={"Dump variables to JSON"}
                    help_text={"Dump all blueprint variables to a JSON file"}
                  ></CheckboxInput>
                </Col>

                <Col sm={6}>
                  {
                    props.form.get("parameters.target") != "local" ? (
                      <CheckboxInput
                        form={props.form}
                        validations={props.validations}
                        path={"parameters.upload_to_remote_target"}
                        label={"Upload to remote target"}
                        help_text={"Upload the generated JSON file to the remote target."}
                      ></CheckboxInput>
                    ) : ""
                  }
                </Col>

                <Col sm={12}>
                  <Alert variant="info" className="py-2 small">
                    Keep in mind that the JSON file will be stored with a random name in the temporary folder of the target OS.
                    Use the following variable in order to find out the exact path to the file. <code>$NEBULANT_JSON_VARIABLES_PATH</code>
                  </Alert>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        <AdvancedSettings>
          <MaxRetries className="mb-0" {...props} />
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Command / script result"}
            help_text={"The exit code, stdout and stderr of your command / script."}
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
