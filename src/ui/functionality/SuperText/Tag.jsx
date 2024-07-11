import { useState } from "react";
import { flushSync } from "react-dom";

import { triggerIntellisenseWithInputEvent } from "@src/ui/functionality/common/onChangeHandler";

export const Tag = (props) => {
  const { values, idx, updateSelectionPreviewHeight, updateValue, deleteValue } = props;

  const value = values[idx];

  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="tagWrapper editable">
      <div className="d-flex align-items-center">

        <div className="txtWrapper">
          <span className="text-nowrap text-truncate">{ inputValue }</span>

          <input
            className="text-truncate"
            value={inputValue}
            onBlur={(e) => updateValue({ idx, value: e.target.value })}
            onKeyDown={(e) => {
              if(e.keyCode === 13) { // Enter
                // Prevent form submission if tag input is nested in <form>
                e.preventDefault();
                e.target.blur();
              } else if(e.keyCode === 8 || e.keyCode === 46) { // Backspace or delete
                if(!e.target.value) e.target.blur();
              } else if(e.keyCode === 27) { // Escape
                flushSync(() => {
                  setInputValue(values[idx]);
                });
                e.target.blur();
              }
            }}
            onChange={(e) => {
              flushSync(() => {
                setInputValue(e.target.value);
              });

              // HACK: trigger parent height recalc
              updateSelectionPreviewHeight();

              triggerIntellisenseWithInputEvent(props);
            }}
            spellCheck="false"
          />
        </div>

        <div
          className="btnDeleteWrapper"
          onClick={() => deleteValue({ idx, value: "" })}
        >
          <div className="btnDelete"></div>
        </div>
      </div>
    </div>
  )
}
