import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { triggerIntellisenseWithInputEvent } from "@src/ui/functionality/common/onChangeHandler";

export const MainInput = (props) => {
  const { placeholder, multi, editable, values, options, onClick, addValue, updateValue, deleteValue } = props;

  const value = values[0] || "";

  // We want to show the tooltip only if this is not a multiselect
  let label;
  if(!multi) {
    label = options.find(v => v.value === value)?.label || "";
  }

  const [inputValue, setInputValue] = useState(multi ? "" : value);

  useEffect(() => {
    if(!multi) {
      setInputValue(values[0] || "");
    }
  }, [values]);

  return (
    <Tooltip label={label} placement="top-start">
      <div className="d-flex mainInputWrapper" onClick={onClick}>
        <input
          className={`${(editable) && "editable"}`}
          placeholder={placeholder}
          onBlur={(e) => {
            if(multi) {
              if(e.target.value) {
                addValue({ idx: 0, value: e.target.value });
                setInputValue("");
                e.target.focus();
              }
            } else {
              if(e.target.value) {
                // **DON'T** use "!==" here. We **DON'T** want to strictly
                // compare the values. The user is typing in an input, which
                // will convert anything to a string, but the underlying value
                // could be an integer.
                if(e.target.value != value) {
                  updateValue({ idx: 0, value: e.target.value });
                }
              } else if(values.length > 0) {
                deleteValue({ idx: 0 });
              }
            }
          }}
          onKeyDown={(e) => {
            if(e.keyCode === 13) { // Enter
              // Prevent form submission if tag input is nested in <form>
              e.preventDefault();
              e.target.blur();
            } else if(e.keyCode === 27) { // Escape
              if(multi) {
                flushSync(() => {
                  setInputValue("");
                });
              } else {
                flushSync(() => {
                  setInputValue(values[0] || "");
                });
              }
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
          {
            ...(
              editable ? {} : {
                disabled: true,
                onClick,
              }
            )
          }
        />

        {
        /*
          !multi && label && (
            <span className="valueLabel text-muted text-smallest px-1 border rounded">{label}</span>
          )
        */
        }

        {
          !multi && values.length > 0 && (
            <div className="btnDeleteWrapper">
              <div className="btnDelete" onClick={(e) => {
                e.stopPropagation();
                deleteValue({ idx: 0 });
                setInputValue("");
              }}></div>
            </div>
          )
        }

        <div className="dropdownTrigger"></div>
      </div>
    </Tooltip>
  );
}
