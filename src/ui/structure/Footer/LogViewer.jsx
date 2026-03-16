import { useEffect, useState, useRef } from "react";
import { List } from "react-window";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

const ROW_HEIGHT = 16;

const Line = ({ filteredMsgs, searchPosition, searchMatches, index, style }) => {
  const { time, level_str, text, html, partial } = filteredMsgs[index];
  const hl = searchMatches[searchPosition-1] === index ? "hl" : "";

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

  const listRef = useRef(null);
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
      if(logFilter !== "" && logSearchPosition > 0) {
        requestAnimationFrame(() => {
          _scrollToItem(logger.searchMatches[logSearchPosition - 1]);
        });
      } else if(logFilter === "" && wasListAtBottom) {
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
      listRef.current?.scrollToRow({ index: pos });
    }
  }

  const isAtBottom = () => {
    const SCROLL_BOTTOM_MARGIN = 5;
    const listWindow = listRef.current?.element;
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

  const followTail = () => {
    requestAnimationFrame(() => { // Measure async, once the scroll has actually happened
      setWasListAtBottom(isAtBottom());
    });
  }

  return (
    <div className="messages p-1">
      <List
        style={{ height: height - 10 }}
        rowCount={logger.filteredMsgs.length}
        rowProps={{
          filteredMsgs: logger.filteredMsgs,
          searchPosition: logSearchPosition,
          searchMatches: logger.searchMatches,
        }}
        rowHeight={ROW_HEIGHT}
        rowComponent={Line}
        onScroll={followTail}
        listRef={listRef}
      />
    </div>
  );
}
