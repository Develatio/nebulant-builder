import { toPNG } from "@joint/format-raster";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

export const saveAsPNG = async (opts = {}) => {
  return new Promise((resolve) => {
    const runtime = new Runtime();
    const eventBus = new EventBus();
    const engine = runtime.get("objects.engine");

    if(!opts?.silent) {
      eventBus.publish("OpenOverlay", {
        message: "Generating PNG, please wait...",
      });
    }

    toPNG(engine, (dataURI) => {
      if(!opts?.silent) {
        eventBus.publish("CloseOverlay");
      }

      resolve(dataURI);
    }, {
      backgroundColor: "transparent",
      padding: 25,
      // TODO: Remove once https://github.com/clientIO/joint/issues/2668 is fixed
      grid: true,
      stylesheet: `
        .joint-grid-layer { display: none; }
      `
      // </TODO>
    });
  });
}
