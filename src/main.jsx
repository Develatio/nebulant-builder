import { createRoot } from "react-dom/client";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { CliConnector } from "@src/core/CliConnector";
import { BuilderAssets } from "@src/core/BuilderAssets";
import { KeyboardHandler } from "@src/core/KeyboardHandler";
import { BackendConnector } from "@src/core/BackendConnector";
import { AccountConnector } from "@src/core/AccountConnector";

// NOTE: This import is **very** deep. The shapes import the implementations,
// which import the validators, the node generators, the migrators and the
// settings, which may import autocompleters, which import the diagram
// generator. The only way to avoid a cyclic dependency is to import it here,
// once, and then store it in the runtime object.
import { shapes } from "@src/components/shapes";

import * as _ from "worker:@src/sw.js";

if(!process.env.PRODUCTION) {
  console.log("[ESBUILD] Listening for live-reload events");
  new EventSource('/fswatch').addEventListener('message', () => location.reload());
}

if("serviceWorker" in navigator) {
  // Wait for the "load" event before trying to deal with service workers
  window.addEventListener("load", () => {
    // Register the service worker
    const logger = new Logger();
    logger.debug("Registering service worker!");
    navigator.serviceWorker.register("/sw.js").then(reg => {
      reg.update();
      setInterval(() => {
        logger.debug("Searching for sw.js updates");
        reg.update();
      }, 1000 * 30);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const runtime = new Runtime();

  // Create the logger and the events dispatcher
  const logger = new Logger();
  runtime.set("objects.logger", logger);

  console.log(`%c🚀 Welcome to Nebulant Builder v${process.env.VERSION}`, `
    padding: 5px 15px;
    background: linear-gradient(to right, #8F1FE5 0%, #3C2FE5 100%);
    font-size: 34px;
    border-radius: 8px;
  `);

  const eventBus = new EventBus();
  runtime.set("objects.eventBus", eventBus);

  // Login / logout
  const accountConnector = new AccountConnector();
  runtime.set("objects.accountConnector", accountConnector);

  // Handle network events from the backend
  const backendConnector = new BackendConnector();
  runtime.set("objects.backendConnector", backendConnector);

  runtime.set("objects.shapes", shapes);

  // Load builder assets
  const builderAssets = new BuilderAssets();
  builderAssets.preload();
  runtime.set("objects.builderAssets", builderAssets);

  // Fetch my own data
  const gconfig = new GConfig();
  backendConnector.getMyself().then(me => {
    runtime.set("state.myself", me);

    if(me.builder_prefs) {
      gconfig.set("", me.builder_prefs, { skip_save_myself: true });
    }
  }).catch(_err => {
    // We just failed at logging in, but the app can still be used.
    gconfig.set(gconfig.getLocalStorage());
  }).finally(() => {
    runtime.set("objects.gconfig", gconfig);

    // Handle keyboard events
    const kbh = new KeyboardHandler();
    runtime.set("objects.keyboard", kbh);

    // Handle network events from the CLI tool
    const cliConnector = new CliConnector();
    runtime.set("objects.cliConnector", cliConnector);

    import("@src/App").then(({ App }) => {
      const app = document.querySelector("#application");
      const root = createRoot(app);
      root.render(<App />);
    });
  });
});
