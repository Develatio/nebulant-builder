import { useState } from "react";
import { flushSync } from "react-dom";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import { triggerIntellisenseWithInputEvent } from "@src/ui/functionality/common/onChangeHandler";

export const Tag = (props) => {
  const { values, idx, options, editable, updateSelectionPreviewHeight, updateValue, deleteValue } = props;

  const value = values[idx];
  const label = options.find(v => v.value === value)?.label || "";

  const [inputValue, setInputValue] = useState(value);

  return (
    <div className={`tagWrapper ${editable && "editable"}`}>
      <div className="d-flex align-items-center">

        <Tooltip label={label} placement="top">
          <div className="txtWrapper">
            <span className="text-nowrap text-truncate">{ inputValue }</span>

            {
              editable && (
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
              )
            }
          </div>
        </Tooltip>

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
