import hljs from "highlight.js/lib/core";
import Editor from "react-simple-code-editor";

import Row from "react-bootstrap/esm/Row";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";

import applescript from "highlight.js/lib/languages/applescript";
import bash from "highlight.js/lib/languages/bash";
import dos from "highlight.js/lib/languages/dos";
import json from "highlight.js/lib/languages/json";
import javascript from "highlight.js/lib/languages/javascript";
import latex from "highlight.js/lib/languages/latex";
import lua from "highlight.js/lib/languages/lua";
import perl from "highlight.js/lib/languages/perl";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import powershell from "highlight.js/lib/languages/powershell";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import shell from "highlight.js/lib/languages/shell";
import tcl from "highlight.js/lib/languages/tcl";
import typescript from "highlight.js/lib/languages/typescript";
import vbscript from "highlight.js/lib/languages/vbscript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

import { onChange, triggerIntellisense } from "@src/ui/functionality/common/onChangeHandler";

hljs.registerLanguage("applescript", applescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("dos", dos);
hljs.registerLanguage("json", json);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("latex", latex);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("perl", perl);
hljs.registerLanguage("php", php);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("python", python);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("tcl", tcl);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("vbscript", vbscript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

const noop = () => {};

export const highlight = (code) => hljs.highlightAuto(code);

export const CodeEditor = (props) => {
  const { onChange: parentOnChange } = props;

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>

      <FormLabel>{props.label ?? "Embedded script"}</FormLabel>

      <InputGroup>
        <div className="editor-wrapper flex-grow-1">
          <Editor
            value={props.form.get(props.path) || ""}
            onValueChange={value => {
              onChange(props, value);
              triggerIntellisense(props);
              parentOnChange?.(value);
            }}
            highlight={code => props.highlight ? props.highlight(code) : noop()}
            padding={props.padding ?? 10}
            textareaId={`codeArea-${props.path}`}
            className="editor"
            preClassName={props.preClassName ?? "language-bash"}
            placeholder={props.placeholder ?? "#!/bin/bash"}
            style={{
              fontFamily: "\"Fira Code\"",
              fontSize: 16,
              outline: 0,
            }}
          />
        </div>
      </InputGroup>

      <FormText className="text-muted">{props.help_text ?? "Write the content of the script you want to execute"}</FormText>

    </FormGroup>
  );
}
