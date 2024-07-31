import {
  set as lodashSet,
  get as lodashGet,
} from "lodash-es";

export class Runtime {
  constructor() {
    if(!!Runtime.instance) {
      return Runtime.instance;
    }

    Runtime.instance = this;

    this._runtime = {
      state: {
        ops_counter: 0,
        myself: null,
        pristineBlueprint: {},
        warn_counter: 0,
        err_counter: 0,

        engine_options: {
          interactive: {
            labelMove: false,
            elementMove: true,
          },
        },

        logging: {
          logFilter: "",
          logSearchPosition: 0,
        },

        stencil: {
          // actions
          actionsFilter: "",
          providers: [],
          actions: [],
          actionGroupIsOpen: false, // check if a (any) action group is open

          // marketplace
          marketplaceActionsFilter: "",
          marketplaceProviders: [],
          marketplaceActions: [],
        },
      },
    };
    this._listeners = {};
  }

  set(keyPath, value) {
    // Don't ever try to serialize "value" (calling JSON.stringify or clone) on
    // it. Objects passed to this function might contain circular references,
    // which will get deleted if serialized, which will break stuff.

    lodashSet(this._runtime, keyPath, value);

    // Notify listeners
    if(keyPath == "") {
      Object.keys(this._listeners).forEach(keyPath => {
        this._listeners[keyPath].forEach(fn => {
          const value = lodashGet(this._runtime, keyPath);
          fn(value);
        });
      });
    } else {
      Object.entries(this._listeners).forEach(([listenerKeyPath, fns]) => {
        const new_value = this.get(listenerKeyPath);

        if(keyPath.startsWith("state") || keyPath == listenerKeyPath) {
          fns.forEach(fn => fn(new_value));
        }
      });
    }

    return this;
  }

  get(keyPath, defaultValue) {
    const ret = lodashGet(this._runtime, keyPath);
    return ret ? ret : defaultValue ? defaultValue : ret;
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
}
