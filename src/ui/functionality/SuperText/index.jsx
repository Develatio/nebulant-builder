import { useRef, useState, useCallback } from "react";

import { useClickAnywhere } from "@src/utils/react/useClickAnywhere";

import { MainInput } from "./MainInput";
import { SelectionPreview } from "./SelectionPreview";

export const SuperText = (props) => {
  const { disabled, values, onChange } = props;

  const superTextRef = useRef(null);
  const [toggle, setToggle] = useState(false);

  // Handle clicks performed outside of the dropdown
  const handleClickOutside = useCallback((e) => {
    if(superTextRef && !superTextRef.current.contains(e.target)) {
      setToggle(false);
    }
  }, []);
  useClickAnywhere(handleClickOutside);
  //

  // Fns that will be passed to child components
  const addValue = ({ idx, value }) => {
    if(values.includes(value)) return;
    values.splice(idx, 0, value);
    onChange(values);
  };
  const updateValue = ({ idx, value }) => {
    if(!value) {
      deleteValue({ idx });
      return;
    }
    values[idx] = value;
    onChange(values);
  }
  const deleteValue = ({ idx }) => {
    values.splice(idx, 1);
    onChange(values);
  }
  //

  return (
    <div
      ref={superTextRef}
      className={`
        supertext
        ${values.length > 0 ? "hasSelections" : ""}
        ${toggle ? "open" : ""}
        ${disabled ? "disabled" : ""}
      `}
    >
      {/* This is the main input */}
      <MainInput
        addValue={addValue}
        updateValue={updateValue}
        deleteValue={deleteValue}
        onClick={() => setToggle(!toggle)}
        { ...props }
      />

      <div className={`
        position-absolute w-100 start-0
        ${toggle ? "shadow rounded-bottom z-5" : ""}
      `}>
        <SelectionPreview
          updateValue={updateValue}
          deleteValue={deleteValue}
          { ...props }
        />
      </div>
    </div>
  )
};
