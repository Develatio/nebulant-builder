import { flushSync } from "react-dom";
import { useEffect, useState, useRef, useCallback } from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Tooltip from "react-bootstrap/esm/Tooltip";
import Overlay from "react-bootstrap/esm/Overlay";

import { Logger } from "@src/core/Logger";
import { EventBus } from "@src/core/EventBus";
import { getXPath } from "@src/utils/getXPath";
import { Icon } from "@src/ui/functionality/Icon";

import QuestionIcon from "@src/assets/img/icons/control/question.svg?transform";

export const Intellisense = () => {
  const selectedEl = useRef(null);
  const containerEl = useRef(null);
  const [_, runTick] = useState(0);

  const logger = new Logger();

  const state = useRef({
    visible: false,
    predictions: [],
    selectedIdx: 0,
    targetInput: null,
    coords: { top: 100, left: 100 },
    promiseHandlers: null,
  });

  useEffect(() => {
    const _open = (_msg, data) => open(data);

    const eventBus = new EventBus();
    eventBus.subscribe("TriggerIntellisense", _open);

    return () => {
      eventBus.unsubscribe("TriggerIntellisense", _open);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKb, true);

    return () => {
      document.removeEventListener("keydown", handleKb, true);
    };
  }, []);

  const open = useCallback((data) => {
    state.current = {
      ...state.current,
      visible: true,
      coords: {
        top: data.coords.top,
        left: data.coords.left,
      },
      selectedIdx: 0,
      predictions: data.predictions,
      targetInput: data.element,
      targetInputXPath: getXPath(data.element),
      promiseHandlers: data.promiseHandlers,
    };
    runTick(tick => tick + 1);

    flushSync(() => {
      containerEl.current.focus();
    });
  }, []);

  const close = useCallback(() => {
    const tmpTargetInput = state.current.targetInput;

    state.current.promiseHandlers.reject();

    state.current = {
      ...state.current,
      visible: false,
      coords: {
        top: 100,
        left: 100,
      },
      selectedIdx: 0,
      predictions: [],
      targetInput: null,
      promiseHandlers: null,
    };

    runTick(tick => tick + 1);

    // Recover input focus
    setTimeout(() => {
      tmpTargetInput.focus();
    });
  }, []);

  const select = useCallback((idx) => {
    let newValue = "", selectionStart, selectionEnd;
    const selectedPrediction = state.current.predictions[idx].key;

    if(state.current.targetInput.selectionStart) {
      let startPos = state.current.targetInput.selectionStart;
      for(let i = startPos; i >= 1; i--) {
        if(state.current.targetInput.value[i] === ".") {
          startPos = i + 1;
          break;
        }
      }

      const endPos = state.current.targetInput.selectionEnd;

      const chunk1 = state.current.targetInput.value.substring(0, startPos);
      const chunk2 = state.current.targetInput.value.substring(endPos, state.current.targetInput.value.length);
      newValue = chunk1 + selectedPrediction + chunk2;

      selectionStart = startPos + selectedPrediction.length;
      selectionEnd = startPos + selectedPrediction.length;
    } else {
      newValue = state.current.targetInput.value + selectedPrediction;
    }

    let input = state.current.targetInput;
    // Check if the input element we're trying to work with actually exists in
    // the DOM. There are certain edge cases in which React will re-render an
    // element which will result in invalid / non-existent DOM references. If
    // this is the case, we'll try to recover the element that we're supposed to
    // be working with using the XPath that we retrieved when the intellisense
    // was triggered.
    if(!document.body.contains(input)) {
      logger.debug("Intellisense is trying to access an element that doesn't exist in the DOM. Falling back to xpath...");

      input = document.evaluate(
        state.current.targetInputXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      )?.singleNodeValue;

      if(!input) {
        logger.error("Intellisense failed trying to find the element. Aborting...");
        state.current.promiseHandlers.reject();
        return;
      }
    }

    state.current.promiseHandlers.resolve({
      input,
      value: newValue,
      caretPositions: [selectionStart, selectionEnd],
    });
  }, []);

  const handleKb = useCallback((event) => {
    // If the Intellisense dialog is not visible, just ignore the event
    if(!state.current.visible) return;

    if(event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      state.current.selectedIdx = state.current.selectedIdx + 1 >= state.current.predictions.length ? 0 : state.current.selectedIdx + 1;
      runTick(tick => tick + 1);
    } else if(event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      state.current.selectedIdx = state.current.selectedIdx === 0 ? state.current.predictions.length - 1 : state.current.selectedIdx - 1;
      runTick(tick => tick + 1);
    } else if(event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
      select(state.current.selectedIdx);
      close();
    } else if(event.key === "Escape"){
      event.preventDefault();
      event.stopPropagation();
      close();
    } else {
      close();
    }
  }, []);

  const getPrediction = (prediction, idx) => {
    const ref = idx == state.current.selectedIdx ? selectedEl : null;

    return (
      <Col
        sm={12}
        key={idx}
        ref={ref}
        className={`${state.current.selectedIdx == idx ? "selected": ""} d-flex justify-content-between py-2`}
        onClick={(event) => {
          event.stopPropagation();
          select(idx);
          close();
        }}
      >
        <div>{ prediction.key }</div>
        <div className="d-flex align-items-end">
          <div className="fst-italic text-muted me-2">{ prediction.type }</div>
          {
            prediction.description && (
              <DocumentationTooltip prediction={prediction} />
            )
          }
        </div>
      </Col>
    )
  }

  // After we have rendered the list, scroll to the selected prediction
  setTimeout(() => {
    selectedEl?.current?.scrollIntoView(false);
  }, 0);

  return (
    <div
      ref={containerEl}
      className={`intellisense ${state.current.visible ? "d-block" : "d-none"}`}
      tabIndex="0"
      onClick={close}
    >
      <div
        className="container position-absolute tiny-shadow rounded"
        style={{ top: state.current.coords.top, left: state.current.coords.left }}
      >
        <Row>
          {
            state.current.predictions.map((prediction, idx) => getPrediction(prediction, idx))
          }
        </Row>
      </div>
    </div>
  )
}

const DocumentationTooltip = (props) => {
  const { prediction } = props;

  const triggerRef = useRef(null);
  const [tooltipVisibility, setTooltipVisibility] = useState(false);

  return (
    <div
      onMouseEnter={() => setTooltipVisibility(true)}
      onMouseLeave={() => setTooltipVisibility(false)}
      className="position-relative"
    >
      <Icon
        ref={triggerRef}
        className="question h-auto w-auto me-0"
      >
        <QuestionIcon />
      </Icon>
      <Overlay
        show={tooltipVisibility}
        placement="auto-start"
        target={triggerRef.current}
        flip={true}
      >
        {({ placement, ...props }) => (
          <Tooltip {...props} placement={placement}>
            { /* biome-ignore lint: I know what I'm doing */ }
            <div className="text-wrap" style={{maxWidth: "400px"}} dangerouslySetInnerHTML={{
              // Note: This is safe. The "description" value is generated by the
              // "generate_shape.js" script, which will take care of
              // sanitization.
              __html: prediction.description || ""
            }}></div>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
}
