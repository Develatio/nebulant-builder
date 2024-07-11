import { useState } from "react";
import { flushSync } from "react-dom";

import { triggerIntellisenseWithInputEvent } from "@src/ui/functionality/common/onChangeHandler";

export const MainInput = (props) => {
  const { placeholder, onClick, addValue } = props;

  const [inputValue, setInputValue] = useState("");

  return (
    <div className="d-flex mainInputWrapper" onClick={onClick}>
      <input
        className="editable"
        placeholder={placeholder}
        onBlur={(e) => {
          if(e.target.value) {
            addValue({ idx: 0, value: e.target.value });
            setInputValue("");
            e.target.focus();
          }
        }}
        onKeyDown={(e) => {
          if(e.keyCode === 13) { // Enter
            // Prevent form submission if tag input is nested in <form>
            e.preventDefault();
            e.target.blur();
          } else if(e.keyCode === 27) { // Escape
            flushSync(() => {
              setInputValue("");
            });
            e.target.blur();
          }
        }}
        onChange={(e) => {
          flushSync(() => {
            setInputValue(e.target.value);
          });
          triggerIntellisenseWithInputEvent(props);
        }}
        spellCheck="false"
        value={inputValue}
      />
    </div>
  );
}
