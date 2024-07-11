import { EventBus } from "@src/core/EventBus";

const eventBus = new EventBus();

export const onLoglineChunkClick = ({ type, text }) => {
  switch (type) {
    case "url":
      window.open(text, "_blank");
      break;

    case "uuid":
      eventBus.publish("CenterOnNode", { node_id: text });
      break;

    default:
      break;
  }
}
