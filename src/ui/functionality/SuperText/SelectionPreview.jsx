import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { useDeepCompareEffect } from "@src/utils/react/useDeepCompareEffect";

import { Tag } from "./Tag";

export const SelectionPreview = (props) => {
  const { values } = props;

  const [valuesLength, setValuesLength] = useState(values.length);

  // Ugly code that lets us transition from <known height> to <unknown height>
  const selectionPreviewRef = useRef(null);
  const [selectionPreviewHeight, setSelectionPreviewHeight] = useState(0);

  const updateSelectionPreviewHeight = useCallback(() => {
    setSelectionPreviewHeight(0);
    setSelectionPreviewHeight(selectionPreviewRef?.current?.scrollHeight);
  }, []);

  useEffect(() => {
    if(!selectionPreviewRef?.current) return;
    const resizeObserver = new ResizeObserver(() => updateSelectionPreviewHeight());
    resizeObserver.observe(selectionPreviewRef?.current);
    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => updateSelectionPreviewHeight(), []);
  useDeepCompareEffect(() => updateSelectionPreviewHeight(), [values]);
  //

  // More ugly that that lets us create the animation that gives the user visual
  // feedback about a new option being selected
  // Yes, I know about the 234982734 packages that implement this. No, I'm not
  // dragging 800kb extra for a single animation. 8 ugly lines will do the job
  // just fine.
  const [addAnimation, setAddAnimation] = useState(false);
  useDeepCompareEffect(() => {
    if(valuesLength < values.length) {
      setAddAnimation(true);
      setTimeout(() => { setAddAnimation(false) }, 1000);
    }
    setValuesLength(values.length);
  }, [values]);

  return (
    <div className="selectionPreviewWrapper" style={{ "animation": addAnimation ? "pulse 1s" : "" }}>
      <div
        ref={selectionPreviewRef}
        className="selectionPreview"
        style={{
          "--ss-selectionPreviewHeight": `${selectionPreviewHeight || 0}px`,
        }}
      >
        {
          values.map((value, idx) => {
            return (
              <Tag
                {...props}
                key={value}
                idx={idx}
                updateSelectionPreviewHeight={updateSelectionPreviewHeight}
              />
            )
          })
        }

        {
          values.length === 0 && (
            <small className="text-muted ms-1">No inserted elements...</small>
          )
        }
      </div>

      <div className="mask"></div>

      <div className="selectionCounter">
        <small>{values.length} inserted</small>
      </div>
    </div>
  )
}
