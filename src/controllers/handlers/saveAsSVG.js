import { toSVG } from "@joint/format-svg";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

export const saveAsSVG = (opts = {}) => {
  return new Promise((resolve) => {
    const runtime = new Runtime();
    const eventBus = new EventBus();
    const engine = runtime.get("objects.engine");

    if(!opts?.silent) {
      eventBus.publish("OpenOverlay", {
        message: "Generating SVG, please wait...",
      });
    }

    toSVG(engine, (dataURI) => {
      if(!opts?.silent) {
        eventBus.publish("CloseOverlay");
      }

      dataURI = `data:image/svg+xml,${encodeURIComponent(dataURI)}`;
      resolve(dataURI);
    }, {
      convertImagesToDataUris: true,
      useComputedStyles: true,
      // TODO: Remove once https://github.com/clientIO/joint/issues/2668 is fixed
      grid: true,
      stylesheet: `
        .joint-grid-layer { display: none; }
      `
      // </TODO>
    });
  });
}
