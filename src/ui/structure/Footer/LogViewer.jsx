import { useEffect, useState, createRef } from "react";
import { FixedSizeList } from "react-window";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

const Line = ({ data, index, style }) => {
  const { time, level_str, text, html, partial } = data.filteredMsgs[index];
  const hl = data.searchMatches[data.searchPosition-1] == index ? "hl" : "";

  return (
    <div className={`d-flex flex-row logline ${hl}`} style={style}>
      {
        partial ? (
          <div className="user-select-none">{"\u00A0".repeat(10)}</div>
        ) : (
          <div className="user-select-none time">[{time}]</div>
        )
      }
      <div className={`line ${level_str}`}>{ html ?? text }</div>
    </div>
  )
};

export const LogViewer = ({ height }) => {
  const logger = new Logger();
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const listBodyRef = createRef();
  const listRef = createRef();
  const [wasListAtBottom, setWasListAtBottom] = useState(true);

  const [logFilter, setLogFilter] = useState("");
  const [logSearchPosition, setLogSearchPosition] = useState(0);
  const [logActivity, setLogActivity] = useState(0);

  useEffect(() => {
    const triggerLogActivity = () => setLogActivity(new Date().getTime());

    runtime.notifyOnChanges("state.logging.logFilter", setLogFilter);
    runtime.notifyOnChanges("state.logging.logSearchPosition", setLogSearchPosition);
    eventBus.subscribe("LogActivity", triggerLogActivity);

    return () => {
      runtime.stopNotifying("state.logging.logFilter", setLogFilter);
      runtime.stopNotifying("state.logging.logSearchPosition", setLogSearchPosition);
      eventBus.unsubscribe("LogActivity", triggerLogActivity);
    };
  }, []);

  // Refresh the log
  useEffect(() => {
    // Auto-scroll
    if(wasListAtBottom && !isAtBottom()) {
      requestAnimationFrame(() => {
        _scrollToItem(logger.filteredMsgs.length - 1);
      });
    } else {
      if(logFilter != "" && logSearchPosition > 0) {
        requestAnimationFrame(() => {
          _scrollToItem(logger.searchMatches[logSearchPosition - 1]);
        });
      } else if(logFilter == "" && wasListAtBottom) {
        requestAnimationFrame(() => {
          _scrollToItem(logger.filteredMsgs.length - 1);
        });
      }
    }
  }, [logActivity]);

  // Scroll to the correct element when searching
  useEffect(() => {
    if(logSearchPosition) {
      _scrollToItem(logger.searchMatches[logSearchPosition - 1]);
    }
  }, [logSearchPosition]);

  const _scrollToItem = (pos) => {
    if(pos !== undefined && pos >= 0) {
      listRef.current?.scrollToItem(pos);
    }
  }

  const isAtBottom = () => {
    const SCROLL_BOTTOM_MARGIN = 5;
    const listWindow = listBodyRef.current?.parentElement;
    if(!listWindow) {
      // This means element hasn't been rendered yet, so we are effectively at the bottom
      return true;
    } else {
      const { scrollTop, scrollHeight, offsetHeight } = listWindow;
      const scrollTopWithMargin = scrollTop + SCROLL_BOTTOM_MARGIN;
      const scrollHeightWithoutOffset = scrollHeight - offsetHeight;
      return scrollTopWithMargin >= scrollHeightWithoutOffset;
    }
  }

  const followTail = (e) => {
    const { scrollDirection, scrollOffset, scrollUpdateWasRequested } = e;
    // Discard fake user event sent by react-window when this component is mounted
    if(
      scrollDirection === "forward" &&
      scrollOffset === 0 &&
      scrollUpdateWasRequested === false
    ) return;

    requestAnimationFrame(() => { // Measure async, once the scroll has actually happened
      setWasListAtBottom(isAtBottom());
    });
  }

  return (
    <div className="messages p-1">
      <FixedSizeList
        height={height - 10}
        width="100%"
        itemCount={logger.filteredMsgs.length}
        itemData={{
          filteredMsgs: logger.filteredMsgs,
          searchPosition: logSearchPosition,
          searchMatches: logger.searchMatches,
        }}
        itemKey={i => logger.filteredMsgs[i].id}
        itemSize={16}
        onScroll={followTail}
        innerRef={listBodyRef}
        ref={listRef}
      >
        {Line}
      </FixedSizeList>
    </div>
  );
}
