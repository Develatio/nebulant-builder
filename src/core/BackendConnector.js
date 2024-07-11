import { Fetch } from "@src/utils/Fetch";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";

export class BackendConnector {
  constructor() {
    if(!!BackendConnector.instance) {
      return BackendConnector.instance;
    }

    this.logger = new Logger();
    this.gconfig = new GConfig();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();

    this.logger.debug("Creating backend connector.");

    BackendConnector.instance = this;

    setInterval(() => {
      this.eventBus.publish("Autosave");
    }, 1000 * 60 * 3);

    return this;
  }

  getMyself() {
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info("Requesting user's profile data from backend...");

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.BACKEND_ENDPOINT}/v1/me/`, {
        credentials: "include",
        timeout: timeout_ms,
        __request_id: "getMyself",
      }).then(response => {
        this.logger.success("Backend replied with user's profile data");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx

          let e;
          if(err.status == 403) {
            e = "Not logged in";
            this.logger.info(e);
          } else {
            e = "Backend failed at retrieving user's profile data";
            this.logger.error(e);

            const data = err.data || {};
            if(data.detail) {
              (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
                this.logger.error(e);
                this.eventBus.publish("Toast", { msg: e, lvl: "error" });
              });
            }
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  saveMyself() {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info("Sending my settings to backend...");

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in";
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().patch(`${process.env.BACKEND_ENDPOINT}/v1/me/`, {
        builder_prefs: me.builder_prefs,
        // Add more fields?
      }, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": me.csrftoken,
        },
        timeout: timeout_ms,
        __request_id: "saveMyself",
      }).then(response => {
        this.logger.success("Backend saved my settings successfully");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed while saving my settings";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              // We don't want to call toast here as we might start spamming the
              // user with tons of toasts. Keep in mind that the function is
              // called very often!
              //this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  getCollections({ limit, offset }) {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info("Requesting collections from backend...");

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in"
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.BACKEND_ENDPOINT}/v1/collection/?limit=${limit}&offset=${offset}`, {
        credentials: "include",
        timeout: timeout_ms,
        __request_id: "getCollections",
      }).then(response => {
        this.logger.success("Backend replied with collections");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed at retrieving collections";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  createBlueprint({ name, description, slug, collection_slug, preview }) {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info("Creating blueprint in backend...");

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in"
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().post(`${process.env.BACKEND_ENDPOINT}/v1/collection/${collection_slug}/blueprint/`, {
        name,
        description,
        slug,
        ...preview && { preview },
      }, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": me.csrftoken,
        },
        timeout: timeout_ms,
        __request_id: "createBlueprint",
      }).then(response => {
        this.logger.success("Backend created a blueprint");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed at creating blueprint";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  getContent({ organization_slug, collection_slug, blueprint_slug, version }) {
    const me = this.runtime.get("state.myself");
    let path = `${organization_slug || ""}/${collection_slug}/${blueprint_slug}:${version || ""}`;
    path = path.replace(/^\//, "").replace(/:$/, "");

    this.logger.info(`Received content path "${path}", let's check where we should fetch it from...`);

    if(me && organization_slug && organization_slug == me.current_organization.slug) {
      this.logger.info("\tThe slug of the organization of the current logged in user matches the organization slug in the path.");

      if(version) {
        this.logger.info("\tA version chunk is present in the path. This is a private snapshot.");
        return this.getPrivateSnapshot({ collection_slug, blueprint_slug, version });
      } else {
        this.logger.info("\tNo version is present in the path. This is a blueprint.");
        return this.getBlueprint({ collection_slug, blueprint_slug });
      }
    } else if(organization_slug) {
      if(me) {
        this.logger.info("\tThe slug of the organization of the current user doesn't match the organization slug in the path. Falling back to marketplace...");
      } else {
        this.logger.info("\tThe user is not logged in, but there is an organization slug in the path. Falling back to marketplace...");
      }

      if(version) {
        this.logger.info("\tA version chunk is present in the path. This is a public snapshot.");
        return this.getPublicSnapshot({ organization_slug, collection_slug, blueprint_slug, version });
      } else {
        this.logger.info("\tNo version chunk is present in the path. Trying with 'latest'...");
        return this.getPublicSnapshot({ organization_slug, collection_slug, blueprint_slug, version: "latest" });
      }
    } else {
      if(me) {
        if(version) {
          this.logger.info("\tA version chunk is present in the path. This is a private snapshot.");
          return this.getPrivateSnapshot({ collection_slug, blueprint_slug, version });
        } else {
          this.logger.info("\tNo version chunk is present in the path. This is a blueprint.");
          return this.getBlueprint({ collection_slug, blueprint_slug });
        }
      } else {
        this.logger.error("\tThe user is not logged in and there is no organization slug in the path.");
        return new Promise((_resolve, reject) => {
          reject(`In order to load ${path} you must be logged in.`);
        });
      }
    }
  }

  getBlueprint({ collection_slug, blueprint_slug }) {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info(`Requesting blueprint ${blueprint_slug} from backend...`);

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in"
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.BACKEND_ENDPOINT}/v1/blueprint/${collection_slug}/${blueprint_slug}/content/`, {
        credentials: "include",
        timeout: timeout_ms,
        __request_id: "getBlueprint",
      }).then(response => {
        this.logger.success("Backend replied with a blueprint");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed at retrieving blueprint";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  getPrivateSnapshot({ collection_slug, blueprint_slug, version }) {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");
    const uri = `${collection_slug}/${blueprint_slug}:${version}`;
    const path = `${collection_slug}/${blueprint_slug}/${version}`;

    this.logger.info(`Requesting snapshot for ${uri} from backend...`);

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in"
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.BACKEND_ENDPOINT}/v1/snapshot/${path}/content/`, {
        credentials: "include",
        timeout: timeout_ms,
        __request_id: "getPrivateSnapshot",
      }).then(response => {
        this.logger.success("Backend replied with a snapshot");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed at retrieving snapshot";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  getPublicSnapshot({ organization_slug, collection_slug, blueprint_slug, version }) {
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");
    const uri = `${organization_slug}/${collection_slug}/${blueprint_slug}:${version}`;
    const path = `${organization_slug}/${collection_slug}/${blueprint_slug}/${version}`;

    this.logger.info(`Requesting snapshot url for ${uri} from marketplace...`);

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.MARKETPLACE_ENDPOINT}/snapshot/${path}/content/`, {
        credentials: "omit",
        timeout: timeout_ms,
        __request_id: "getPublicSnapshot",
      }).then(response => {
        this.logger.success("Marketplace replied with a snapshot");
        resolve(response.data);

        // In case people start abusing our market storage, uncomment this
        /*
        this.logger.success("Marketplace replied with a snapshot url");

        const { url } = response.data;
        this.logger.info(`Trying to fetch ${url}...`);

        new Fetch().get(url, {
          credentials: "omit",
          timeout: timeout_ms,
          __request_id: "getPublicSnapshotContent",
        }).then(response => {
          this.logger.success("Marketplace storage replied with a snapshot");
          resolve(response.data);
        }).catch(err => {
          if(err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const e = "Marketplace storage failed at retrieving snapshot";
            this.logger.error(e);
            reject(e);
          } else {
            const e = "Marketplace storage didn't reply";
            this.logger.error(e);
            reject(e);
          }
        });
        */
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Marketplace failed at retrieving snapshot";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Marketplace didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  getBlueprints({ collection_slug, limit, offset }) {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info("Requesting blueprints from backend...");

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in"
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.BACKEND_ENDPOINT}/v1/collection/${collection_slug}/blueprint/?limit=${limit}&offset=${offset}`, {
        credentials: "include",
        timeout: timeout_ms,
        __request_id: "getBlueprints",
      }).then(response => {
        this.logger.success("Backend replied with blueprints");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed at returning blueprints";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }

  saveBlueprint({ collection_slug, blueprint_slug, blueprint, preview }) {
    const me = this.runtime.get("state.myself");
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info(`Sending blueprint ${blueprint_slug} to backend...`);

    if(!me) return new Promise((_resolve, reject) => {
      const e = "Not logged in"
      this.logger.error(e);
      reject(e);
    });

    return new Promise((resolve, reject) => {
      new Fetch().patch(`${process.env.BACKEND_ENDPOINT}/v1/blueprint/${collection_slug}/${blueprint_slug}/content/`, {
        blueprint,
        ...preview && { preview },
        // collection.uuid ?
      }, {
        timeout: timeout_ms,
        __request_id: "saveBlueprint",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": me.csrftoken,
        },
      }).then(response => {
        this.logger.success("Backend saved the blueprint");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Backend failed while saving the blueprint";
          this.logger.error(e);

          const data = err.data || {};
          if(data.detail) {
            (Array.isArray(data.detail) ? data.detail : [data.detail]).forEach(e => {
              this.logger.error(e);
              this.eventBus.publish("Toast", { msg: e, lvl: "error" });
            });
          }

          reject(e);
        } else {
          const e = "Backend didn't reply";
          this.logger.error(e);
          this.logger.error(err.error?.message || "Unknown error");
          reject(e);
        }
      });
    });
  }
}
