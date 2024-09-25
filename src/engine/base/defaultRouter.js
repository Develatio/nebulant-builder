import { routers } from "@joint/core";

const PADDING = 30;

export const defaultRouter = function(vertices, opts, linkView) {
  const engine = linkView.paper;
  const link = linkView.model;

  // Add the sourceView's magnet to the (start of the) array of vertices
  const iS = link.getConnectedCellInfo("source");
  const portS = linkView.sourceView.model.getPortById(iS.cellPortId);
  const magnetS = linkView.sourceView.model.getPortByGroup(portS.group);
  const magnetViewS = linkView.sourceView.findPortNode(magnetS.id);
  const magnetViewBBoxS = magnetViewS.getBBox();

  let pS = magnetViewS.getBoundingClientRect();
  pS = engine.clientToLocalPoint({
    x: pS.x + (magnetViewBBoxS.width / 2),
    //y: pS.y + (magnetViewBBoxS.height / 2),
    y: 0,
  });
  pS.y = linkView.sourceView.model.getBBox().bottomLine().end.y;
  pS = pS.offset(0, PADDING);

  vertices.unshift(pS);

  // Check if the link has a target (it might not have it if it's
  // currently being created)
  if(linkView.targetView) {
    const iT = link.getConnectedCellInfo("target");
    const portT = linkView.targetView.model.getPortById(iT.cellPortId);
    const magnetT = linkView.targetView.model.getPortByGroup(portT.group);
    const magnetViewT = linkView.targetView.findPortNode(magnetT.id);
    const magnetViewBBoxT = magnetViewT.getBBox();

    let pT = magnetViewT.getBoundingClientRect();
    pT = engine.clientToLocalPoint({
      x: pT.x + (magnetViewBBoxT.width / 2),
      //y: pT.y + (magnetViewBBoxT.height / 2),
      y: 0,
    });
    pT.y = linkView.targetView.model.getBBox().topLine().start.y;
    pT = pT.offset(0, -PADDING);

    vertices.push(pT);
  }

  return routers.manhattan(
      vertices,
      {
        ...opts,

        // This value will cause bad looking links in certain situations. Check
        // https://github.com/clientIO/joint/issues/2763
        step: 10,

        maximumLoops: 10000,
        maxAllowedDirectionChange: 90,
        startDirections: ["bottom"],
        endDirections: ["top"],
        padding: 0,

        //fallbackRouter: routers.rightAngle,
      },
      linkView,
  );
}
