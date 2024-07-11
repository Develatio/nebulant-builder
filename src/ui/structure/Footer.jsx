import { throttle } from "lodash-es";
import { useState, useEffect } from "react";

import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { Logger, LOGLEVELS } from "@src/core/Logger";

import { Hidder } from "@src/ui/structure/Footer/controls/hidder";
import { StatusBar } from "@src/ui/structure/Footer/StatusBar";
import { LogViewer } from "@src/ui/structure/Footer/LogViewer";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import MenuIcon from "@src/assets/img/icons/control/menu.svg?transform";
import TrashIcon from "@src/assets/img/icons/control/trash.svg?transform";
import SearchIcon from "@src/assets/img/icons/control/search.svg?transform";
import CaretLeft from "@src/assets/img/icons/control/caret-left.svg?transform";
import DownloadIcon from "@src/assets/img/icons/control/download.svg?transform";
import CaretRight from "@src/assets/img/icons/control/caret-right.svg?transform";
import ClipboardIcon from "@src/assets/img/icons/control/clipboard.svg?transform";

export const Footer = () => {
  const logger = new Logger();
  const gconfig = new GConfig();
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const [height, setHeight] = useState(300);
  const [isBeingResized, setIsBeingResized] = useState(false);

  const throttledSetHeight = throttle(setHeight, 10);

  const [visible, setVisibility] = useState(gconfig.get("ui.panels.footer.visible"));
  const [logFilter, setLogFilter] = useState("");
  const [logSearchPosition, setLogSearchPosition] = useState(0);
  const [logLevel, setLogLevel] = useState(gconfig.get("core.logging.logLevel"));

  useEffect(() => {
    gconfig.notifyOnChanges("ui.panels.footer.visible", setVisibility);
    gconfig.notifyOnChanges("core.logging.logLevel", setLogLevel);
    runtime.notifyOnChanges("state.logging.logFilter", setLogFilter);
    runtime.notifyOnChanges("state.logging.logSearchPosition", setLogSearchPosition);

    return () => {
      gconfig.stopNotifying("ui.panels.footer.visible", setVisibility);
      gconfig.stopNotifying("core.logging.logLevel", setLogLevel);
      runtime.stopNotifying("state.logging.logFilter", setLogFilter);
      runtime.stopNotifying("state.logging.logSearchPosition", setLogSearchPosition);
    };
  }, []);

  const rsMouseDownHandler = (e) => {
    const y = e.clientY;
    const initialHeight = height;

    setIsBeingResized(true);

    const mouseMoveHandler = (e) => {
      if(e.clientY < 100) return; //
      if(e.clientY + 150 >= window.innerHeight) return; //
      throttledSetHeight(initialHeight + (y - e.clientY));
    }

    const mouseUpHandler = () => {
      setIsBeingResized(false);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  return (
    <div className="application-footer d-flex flex-column">
      {
        visible ? (
          <div
            className="resizer"
            style={{ cursor: 'ns-resize' }}
            onMouseDown={rsMouseDownHandler}
          ></div>
        ) : ""
      }

      <div
        className={`
          logviewer d-flex flex-column
          ${visible ? "visible" : "hidden"}`
        }
        style={{
          height: visible ? height : 0,
          maxHeight: height,
          transition: isBeingResized ? "0s" : "0.4s",
        }}
      >
        <Hidder />

        <div className="actions top d-flex flex-row px-1">
          <div className="d-flex debug_level me-1">
            <div className="d-flex ms-1">
              {
                [
                  LOGLEVELS.CRITICAL, LOGLEVELS.ERROR, LOGLEVELS.WARNING,
                  LOGLEVELS.SUCCESS, LOGLEVELS.INFO, LOGLEVELS.DEBUG,
                ].map((_logLevel, idx) => (
                  <div
                    key={idx}
                    className={`level ${logLevel == _logLevel ? "current" : ""}`}
                    onClick={() => {
                      gconfig.set("core.logging.logLevel", _logLevel);
                      logger.updateLogView();
                    }}
                  >{idx + 1}</div>
                ))
              }
            </div>
            <Tooltip
              placement="top"
              label={<>Set the verbosity level</>}
            >
              <div className="menu p-2">
                <MenuIcon className="menu-icon" />
              </div>
            </Tooltip>
          </div>

          <div className="d-flex search px-2 py-1">
            <SearchIcon className="search-icon" />

            <input type="text" placeholder="Search..." value={logFilter} onChange={(e) => {
              const v = e.target.value;
              runtime.set("state.logging.logFilter", v);
              logger.updateLogView();
              runtime.set("state.logging.logSearchPosition", logger.searchMatches.length); // Go to the last result
            }} />

            {
              logFilter ? (
                <span className="counter">{logSearchPosition} / {logger.searchMatches.length}</span>
              ) : ""
            }

            {
              logFilter ? (
                <div className="left-icon" onClick={() => {
                  const p = runtime.get("state.logging.logSearchPosition");
                  runtime.set("state.logging.logSearchPosition", p - 1 == 0 ? logger.searchMatches.length : p - 1)
                }}>
                  <CaretLeft />
                </div>
              ) : ""
            }

            {
              logFilter ? (
                <div className="right-icon" onClick={() => {
                  const p = runtime.get("state.logging.logSearchPosition");
                  runtime.set("state.logging.logSearchPosition", p == logger.searchMatches.length ? 1 : p + 1)
                }}>
                  <CaretRight />
                </div>
              ) : ""
            }
          </div>
        </div>

        <div className="actions bottom d-flex flex-row">
          <div className="d-flex export me-1" onClick={() => {
            const data = logger.msgs.map(msg => `[${msg.time}] ${msg.text}`).join("\n");
            const downloadAnchorEl = document.createElement('a');
            const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            const dlurl = window.URL.createObjectURL(blob);
            downloadAnchorEl.href = dlurl;
            downloadAnchorEl.target = '_blank';
            downloadAnchorEl.download = `nebulant_log_${new Date().toISOString().replaceAll(":", ".")}.txt`;
            downloadAnchorEl.click();
            downloadAnchorEl.remove();
            window.URL.revokeObjectURL(dlurl);
          }}>
            <Tooltip
              placement="left"
              label={<>Exprot the content of the log viewer to a file</>}
            >
              <DownloadIcon className="download" />
            </Tooltip>
          </div>

          <div className="d-flex clipboard me-1" onClick={() => {
            navigator.clipboard.writeText(logger.msgs.map(msg => `[${msg.time}] ${msg.text}`).join("\n"));
          }}>
            <Tooltip
              placement="left"
              label={<>Copy the content of the log viewer to the clipboard</>}
            >
              <ClipboardIcon className="copy" />
            </Tooltip>
          </div>

          <div className="d-flex clear" onClick={() => eventBus.publish("ClearLog")}>
            <Tooltip
              placement="left"
              label={<>Clear the log viewer (<kbd>ctrl + l</kbd>)</>}
            >
              <TrashIcon className="trash" />
            </Tooltip>
          </div>
        </div>

        { visible && <LogViewer height={height} /> }
      </div>

      <StatusBar />
    </div>
  );
}
