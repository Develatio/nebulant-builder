import { useEffect, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";

import { EventBus } from "@src/core/EventBus";
import { WModal } from "@src/ui/structure/WModal/WModal";

export const Overlay = () => {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const eventBus = new EventBus();

    const close = () => {
      setData({});
      setVisible(false);
    }

    const open = (_msg, data) => {
      setData(data);
      setVisible(true);
    }

    eventBus.subscribe("OpenOverlay", open);
    eventBus.subscribe("CloseOverlay", close);

    return () => {
      eventBus.unsubscribe("OpenOverlay", open);
      eventBus.unsubscribe("CloseOverlay", close);
    };
  }, []);

  if(!visible) return "";

  return (
    <WModal
      size="md"
      visible={visible}
      close={() => {}}
      keyboard={false}
    >
      <Alert variant={data.variant ?? "light"} className="mb-0 text-center overlay">
        { data.message }
      </Alert>
    </WModal>
  );
}
