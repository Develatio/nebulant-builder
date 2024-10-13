import { useEffect, useState } from "react";

import { EventBus } from "@src/core/EventBus";
import { GConfig } from "@src/core/GConfig";

import CloseIcon from "@src/assets/img/icons/control/close.svg?transform";
import DownloadIcon from "@src/assets/img/icons/control/download.svg?transform";
import DownloadCliIcon from "@src/assets/img/icons/ui/downloadCli.svg?transform";
import DownloadCliBgIcon from "@src/assets/img/icons/ui/downloadCliBg.svg?transform";

export const DownloadCli = () => {
  const gconfig = new GConfig();

  const [visible, setVisible] = useState(false);

  const close = () => setVisible(false);
  const open = (_msg, _data) => setVisible(true);

  useEffect(() => {
    const eventBus = new EventBus();

    if(gconfig.get("ui.showDownloadCli_1")) {
      setVisible(true);
    }

    eventBus.subscribe("OpenDownloadCli", open);

    return () => {
      eventBus.unsubscribe("OpenDownloadCli", open);
    };
  }, []);

  if(!visible) return "";

  return (
    <div className="downloadCli pt-4 pb-3 px-3">
      <div className="wrapper">
        <div className="close pointer">
          <CloseIcon
            className="icon"
            onClick={() => {
              setVisible(false);
              gconfig.set("ui.showDownloadCli_1", false);
            }}
          />
        </div>

        <div className="bg_wrapper">
          <DownloadCliBgIcon className="bg" />
        </div>

        <div className="content d-flex flex-column align-items-center gap-4">
          <div className="img_wrapper">
            <DownloadCliIcon className="img" />
          </div>

          <div className="title user-select-none">
            Make sure you have installed the CLI
          </div>

          <div className="description user-select-none">
            The CLI is required to run the blueprints. You'll also be able to use
            it for real-time data retrieval from your cloud providers,
            autocompletion and other features.
          </div>

          <div className="d-flex flex-column gap-3 align-items-center w-100 user-select-none">
            <div
              className="cta gap-1 p-2 d-flex align-items-center justify-content-center pointer"
              onClick={() => window.open(process.env.DOWNLOAD_CLI_URL, "_blank")}
            >
              <DownloadIcon className="icon" /> Download
            </div>

            {
              gconfig.get("ui.showDownloadCli_1") == false ? (
                <div
                  className="hide text-center ps-4 pointer"
                  onClick={() => {
                    setVisible(false);
                    gconfig.set("ui.showDownloadCli_2", false);
                  }}
                >Don't show this again</div>
              ) : ""
            }
          </div>
        </div>
      </div>
    </div>
  );
}
