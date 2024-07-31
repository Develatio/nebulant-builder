import { Fetch } from "@src/utils/Fetch";
import { Logger } from "@src/core/Logger";
import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";

export class MarketplaceConnector {
  constructor() {
    if(!!MarketplaceConnector.instance) {
      return MarketplaceConnector.instance;
    }

    this.logger = new Logger();
    this.gconfig = new GConfig();
    this.runtime = new Runtime();

    this.logger.debug("Creating marketplace connector.");

    MarketplaceConnector.instance = this;

    return this;
  }

  getBlueprints({ searchTerm, provider }) {
    const timeout_ms = this.gconfig.get("core.backend_timeout_ms");

    this.logger.info("Requesting blueprints from marketplace...");

    return new Promise((resolve, reject) => {
      new Fetch().get(`${process.env.MARKETPLACE_ENDPOINT}/v1/marketplace_blueprint/?provider=${provider}&searchTerm=${searchTerm}`, {
        credentials: "include",
        timeout: timeout_ms,
        __request_id: "searchMarketplace",
      }).then(response => {
        this.logger.success("Marketplace replied with results");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const e = "Marketplace failed at providing results";
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
}
