import { dia, mvc } from '@joint/core';
import { Runtime } from "@src/core/Runtime";

const LOCAL_STORAGE_KEY = "clipboard";

export class ClipboardHandler {
    constructor() {
      this.runtime = new Runtime();
      this.cb_collection = new mvc.Collection();
    }

    copy(selection, graph) {
      let originalCells = [];
      selection.toArray().forEach(cell => {
        originalCells.push(cell, ...cell.getEmbeddedCells({ deep: true }));
      });

      const graphClone = graph.cloneSubgraph(originalCells, { deep: true });
      const cells = Object.values(graphClone).sort(
        (a, b) => (a.attributes.z || 0) - (b.attributes.z || 0)
      );

      this.cb_collection.reset(cells);

      const payload = JSON.stringify(this.cb_collection.toJSON());
      localStorage.setItem(LOCAL_STORAGE_KEY, payload);

      return originalCells;
    }

    cut(selection, graph) {
      graph.startBatch('cut');
      this.copy(selection, graph).forEach(e => e.remove());
      graph.stopBatch('cut');
    }

    paste(graph) {
      this.updateFromStorage(graph);

      const maxZIndex = graph.maxZIndex();
      const cells = this.cb_collection.toArray().map((cell, idx) => {
        cell.set('z', maxZIndex + idx + 1);

        // It's necessary to unset the collection reference here. mvc.Collection
        // adds collection attribute to every new model, except if the model
        // already has one. The pasted elements needs to have collection
        // attribute set to the Graph collection (not the Selection collection).
        cell.collection = null;

        return cell;
      }).sort(
        (a, b) => (a.isLink() ? 2 : 1) - (b.isLink() ? 2 : 1)
      );

      // Move the cells to the center of the visible area (viewport)
      // Step 1: Find the center of the viewport
      const scroller = this.runtime.get("objects.engine.scroller");
      const viewportCenterP = scroller.getVisibleArea().center();

      // Step 2: Find the cell located at the left-most coordinate
      const theCell = cells.reduce((acc, cell) => {
        if(!acc) return cell;
        return acc.position().x < cell.position().x ? acc : cell;
      }, null);

      // Step 3: Move the cell to the center of the viewport and get the
      // displacement delta
      const cellCurrentPosP = theCell.position();
      const bbox = theCell.getBBox();
      theCell.position(
        viewportCenterP.x - (bbox.width / 2),
        viewportCenterP.y - (bbox.height / 2),
      );
      const cellNewPosP = theCell.position();
      const displacementDelta = {
        x: cellNewPosP.x - cellCurrentPosP.x,
        y: cellNewPosP.y - cellCurrentPosP.y,
      }

      // Step 4: Move all the cells using the displacement delta
      cells.forEach(cell => {
        if(cell.id === theCell.id) return;
        cell.translate(displacementDelta.x, displacementDelta.y);
      });

      graph.startBatch('paste');
      graph.addCells(cells);
      graph.stopBatch('paste');

      this.copy(this.cb_collection, graph);

      return cells;
    }

    updateFromStorage(graph) {
      const cells = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || null;
      if (!cells) return;

      const graphJSON = { cells };
      // Note there is a `{ sort: false }` option passed to make sure
      // the temporary graph does not change the order of cells.
      // i.e. elements must stay before links
      const cellNamespace = graph.get('cells').cellNamespace;
      const tmpGraph = new dia.Graph([], { cellNamespace }).fromJSON(graphJSON, { sort: false, dry: true });
      this.cb_collection.reset(tmpGraph.getCells());
    }
}
