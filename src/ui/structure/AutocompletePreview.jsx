import { useState, useEffect } from "react";

import { EventBus } from "@src/core/EventBus";
import { BaseEngine } from "@src/engine/BaseEngine";
import { WBody } from "@src/ui/structure/WModal/WBody";
import { WModal } from "@src/ui/structure/WModal/WModal";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

export const AutocompletePreview = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const eventBus = new EventBus();

    const open = (_msg, {model }) => {
      const engine = BaseEngine({ model });
      setVisible(true);

      setTimeout(() => {
        engine.drawOn(".autocompletePreviewModal #autocompletePreview");
      });
    }

    eventBus.subscribe("OpenAutocompletePreview", open);

    return () => {
      eventBus.unsubscribe("OpenAutocompletePreview", open);
    }
  }, []);

  const close = () => {
    setVisible(false);
  }

  if(!visible) return "";

  return (
    <WModal
      visible={visible}
      close={close}
      className="autocompletePreviewModal"
    >
      <WHeader>Autocomplete blueprint preview</WHeader>

      <WBody>
        <div className="blueprint-container">
          <div id="autocompletePreview" className="canvas"></div>
        </div>
      </WBody>

      <WFooter close={close}></WFooter>
    </WModal>
  );
}
