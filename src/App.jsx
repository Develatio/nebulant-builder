import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Main } from "@src/ui/structure/Main";
import { FileDnD } from "@src/ui/structure/FileDnD";
import { Dialog } from "@src/ui/structure/Dialog/Dialog";
import { Overlay } from "@src/ui/structure/Overlay/Overlay";

import "@src/App.scss";

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FileDnD>
        <div className="application">
          <Dialog />
          <Overlay />
          <Main />
        </div>
      </FileDnD>
    </DndProvider>
  );
}
