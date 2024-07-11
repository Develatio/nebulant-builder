import { g } from "@joint/core";

// This is our own Layout manager. It ain't much, but it's honest work.
// The Layout must be initialized by passing a node. Once initialized, a virtual
// grid will be created around that node. Each square in that grid we'll call
// "segment".
// Segments have coordinates (x, y), (0, 0) being the node that was used to
// initialize the Layout. The X axis increases moving to the right, the Y axis
// increases moving down.
// E.g. the segment that would be located 1 square to the right of the node that
// was used to initialize the Layout and 1 square down would be (1, 1), while
// the segment that would be located 1 square to the left and 1 square up would
// be (-1, -1).

export class Layout {
  // Build the layout starting from the passed node
  constructor(node, opts = {}) {
    this.node = node;

    // The padding that should be left on all sides of the node when calculating
    // the grid segments
    this.padding = opts.padding ?? 20;

    const { x, y, width, height } = node.getBBox();
    this.x = x - this.padding;
    this.y = y - this.padding;
    this.width = width + (this.padding * 2);
    this.height = height + (this.padding * 2);
  }

  getBBoxOfGridSegment(gridSegment) {
    const [x, y] = gridSegment;

    return g.Rect(
      this.x + (x * this.width),  /* x      */
      this.y + (y * this.height), /* y      */
      this.width,                 /* width  */
      this.height,                /* height */
    );
  }

  // This method will move the node to the grid segment (the center of the node
  // will match the center of the grid segment) and then it will return the
  // delta between the previous and the current position of the node.
  moveNodeToGridSegment(gridSegment, node) {
    const gridSegmentCenter = this.getBBoxOfGridSegment(gridSegment).center();
    const { x, y, width, height } = node.getBBox();

    const newX = gridSegmentCenter.x - (width / 2);
    const newY = gridSegmentCenter.y - (height / 2);

    node.position(newX, newY);

    return {
      x: newX - x,
      y: newY - y,
    };
  }

  // This method will accept a grid displacement (an array of two numbers
  // indicating a number of grid segments displacement on both axis) and it will
  // return a delta.
  generateDeltaFromGridDisplacement(gridDisplacement) {
    const [x, y] = gridDisplacement;

    return {
      x: x * this.width,
      y: y * this.height,
    };
  }

  // Apply a delta to the position of all the passed nodes
  applyDeltaToNodes(delta, nodes) {
    nodes.forEach(node => {
      const { x, y } = node.getBBox();
      node.position(x + delta.x, y + delta.y);
    });
  }

  // Check if any of the nodes' position is intersecting with another node, and
  // if so, apply delta to all nodes. Repeat until none of the nodes' position
  // is intersecting with another node.
  //
  // The "childrenOf" param can be used to limit the nodes that will be
  // considered as intersected, evaluating only the nodes that are direct
  // children of "childrenOf".
  avoidIntersections(delta, nodes, childrenOf = null) {
    const nodes_ids = nodes.map(node => node.id);
    let i = 1000;
    while(i > 0) {
      let shouldApplyDelta = false;

      for(let node of nodes) {
        const bbox = node.getBBox();
        let models = node.graph.findModelsInArea(bbox);

        // Filter only current layer
        models = models.filter(model => model.getParentCell()?.id === childrenOf?.id);

        // Exclude the nodes themselves when checking for intersections
        models = models.filter(model => !nodes_ids.includes(model.id));

        if(models.length > 0) {
          shouldApplyDelta = true;
          break;
        }
      }

      if(shouldApplyDelta) {
        this.applyDeltaToNodes(delta, nodes);
      } else {
        break;
      }

      i--;
    }
  }
}
