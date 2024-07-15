import { util } from "@joint/core";
import {
  set as lodashSet,
  get as lodashGet,
} from "lodash-es";
import { clone } from "@src/utils/lang/clone";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { Logger, LOGLEVELS } from "@src/core/Logger";

const DEFAULT_CONFIG = {
  cli: {
    endpoint: "http://localhost:15678",
    ws_endpoint: "ws://localhost:15678/ws",
    auto_connect: false,
    retry_ms: 10000,
    timeout_ms: 10000,
  },
  core: {
    backend_timeout_ms: 10000,
    logging: {
      logLevel: LOGLEVELS.INFO,
    },
  },
  ui: {
    shadows: false,
    minimap: false,
    highlight_onhover: true,
    highlight_animations: true,
    showInfo: false, // Show / hide the comments of each node

    links: {
      type: "smart", // simple | smart
      // "static" is for internal use only
    },

    shapes: {
      orientation: "vertical", // vertical | horizontal
    },

    grid: {
      snap: true,
      size: 20,
    },

    panels: {
      sidebarLeft: {
        visible: true,
      },
      sidebarRight: {
        visible: true,
      },
      footer: {
        visible: false,
      },
    },

    stencil: {
      enabledProviders: [
        "generic",
        "executionControl",
        "aws",
        "hetznerCloud",
        "azure",
        "googleCloud",
        "ovhCloud",
        "cloudflare",
      ],
      selectedProvider: "",
    },
  },
  advanced: {
    show_warnings: true,
    show_errors: true,
    debug: false,
    debug_network: false,
  }
};

export class GConfig {
  constructor() {
    if(!!GConfig.instance) {
      return GConfig.instance;
    }

    this.runtime = new Runtime();
    this.eventBus = new EventBus();
    this.logger = new Logger();

    this.logger.debug("Initializing global config.");

    GConfig.instance = this;

    this._config = clone(DEFAULT_CONFIG);

    this._listeners = {};
  }

  set(keyPath, value, opts = {}) {
    const backendConnector = this.runtime.get("objects.backendConnector");

    value = clone(value);
    // Handle global assign (empty keyPath)
    if(keyPath == "") {
      this._config = util.merge(clone(DEFAULT_CONFIG), value);
    } else {
      lodashSet(this._config, keyPath, value);
    }

    // Update our config
    const me = this.runtime.get("state.myself");
    if(me) {
      me.builder_prefs = clone(this._config);
      this.runtime.set("state.myself", me);
    }

    // Notify listeners
    if(keyPath == "") {
      Object.keys(this._listeners).forEach(keyPath => {
        this._listeners[keyPath].forEach(fn => {
          const value = lodashGet(this._config, keyPath);
          fn(value);
        });
      });
    } else {
      Object.entries(this._listeners).forEach(([listenerKeyPath, fns]) => {
        const new_value = this.get(listenerKeyPath);
        fns.forEach(fn => fn(new_value));
      });
    }

    if(me && !opts.skip_save_myself) {
      backendConnector.saveMyself().catch(error => {
        this.eventBus.publish("Toast", { msg: error, lvl: "error" });
      });
    }

    // Save the prefs in local storage
    localStorage.setItem("builder_prefs", JSON.stringify(this._config));

    return this;
  }

  get(keyPath) {
    if(keyPath == "") {
      return this._config;
    }
    return lodashGet(this._config, keyPath);
  }

  notifyOnChanges(keyPath, fn) {
    this._listeners[keyPath] ||= [];
    this._listeners[keyPath].push(fn);
  }

  stopNotifying(keyPath, fn) {
    const idx = this._listeners[keyPath].indexOf(fn);
    if(idx > -1) {
      this._listeners[keyPath].splice(idx, 1);
    }
  }

  getLocalStorage() {
    const builder_prefs = localStorage.getItem("builder_prefs");

    if(builder_prefs) {
      try {
        JSON.parse(builder_prefs);
      } catch (_) {
        // We tried to parse the localStorage and we failed for some reason.
        // Not a big deal...
        this.logger.warn("Failed parsing the builder_pref object from localStorage. Cleaning...");
        localStorage.removeItem("builder_prefs");
      }
      return builder_prefs
    } else {
      return clone(DEFAULT_CONFIG);
    }
  }
}
