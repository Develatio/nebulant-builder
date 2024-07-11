import PubSub from "pubsub-js";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export class EventBus {
  constructor() {
    if(!!EventBus.instance) {
      return EventBus.instance;
    }

    this.paused = false;

    EventBus.instance = this;

    this.runtime = new Runtime();
    this.logger = new Logger();
  }

  // Note that this method won't log messages.
  //
  // This method exists because there is a circular
  // dependency between the logger and the event bus.
  _rawPublish(msg, data) {
    if(this.paused) {
      return;
    }

    PubSub.publish(msg, data);
  }

  publish(msg, data) {
    if(this.paused) {
      return;
    }

    this.logger.debug(`Publishing '${msg}' event.`);
    PubSub.publish(msg, data);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  subscribe(msg, fn) {
    this.logger.debug(`Subscribing to '${msg}' event.`);
    return PubSub.subscribe(msg, fn);
  }

  unsubscribe(msg, fn) {
    this.logger.debug(`Unsubscribing from '${msg}' handler.`);
    return PubSub.unsubscribe(fn);
  }
}
