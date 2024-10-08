import { createRoot } from "react-dom/client";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { CliConnector } from "@src/core/CliConnector";
import { BuilderAssets } from "@src/core/BuilderAssets";
import { KeyboardHandler } from "@src/core/KeyboardHandler";
import { BackendConnector } from "@src/core/BackendConnector";

// NOTE: This import is **very** deep. The shapes import the implementations,
// which import the validators, the node generators, the migrators and the
// settings, which may import autocompleters, which import the diagram
// generator. The only way to avoid a cyclic dependency is to import it here,
// once, and then store it in the runtime object.
import { shapes } from "@src/components/shapes";

import { Playground } from "@src/playground/main";

document.addEventListener("DOMContentLoaded", () => {
  const runtime = new Runtime();

  // Create the logger and the events dispatcher
  const logger = new Logger();
  runtime.set("objects.logger", logger);

  const eventBus = new EventBus();
  runtime.set("objects.eventBus", eventBus);

  // Handle network events from the backend
  const backendConnector = new BackendConnector();
  runtime.set("objects.backendConnector", backendConnector);

  runtime.set("objects.shapes", shapes);

  // Load builder assets
  const builderAssets = new BuilderAssets();
  builderAssets.preload();
  runtime.set("objects.builderAssets", builderAssets);

  // Fetch my own data
  let gconfig = new GConfig();
  backendConnector.getMyself().then(me => {
    runtime.set("state.myself", me);

    if(me.builder_prefs) {
      gconfig.set("", me.builder_prefs, { skip_save_myself: true });
    }
  }).catch(_err => {
    // We just failed at logging, but the app can still be used.

    const builder_pref = localStorage.getItem("builder_prefs");
    if(builder_pref) {
      try {
        gconfig.set("", JSON.parse(builder_pref));
      } catch (_) {
        // We tried to parse the localStorage and we failed for some reason.
        // Not a big deal...
        logger.warn("Failed parsing the builder_pref object from localStorage. Cleaning...");
        localStorage.removeItem("builder_prefs");
      }
    }
  }).finally(() => {
    runtime.set("objects.gconfig", gconfig);

    // Handle keyboard events
    const kbh = new KeyboardHandler();
    runtime.set("objects.keyboard", kbh);

    // Handle network events from the CLI tool
    const cliConnector = new CliConnector();
    runtime.set("objects.cliConnector", cliConnector);

    const app = document.querySelector("#application");
    const root = createRoot(app);
    root.render(<Playground />);
  });
});
