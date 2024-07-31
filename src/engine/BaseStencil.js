import { util } from "@joint/core";
import { clone } from "@src/utils/lang/clone";

import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { providers as allProviders } from "@src/components/ddWidgets";
import { MarketplaceConnector } from "@src/core/MarketplaceConnector";

export class BaseStencil {
  constructor(opts = {}) {
    const gconfig = new GConfig();

    opts = util.merge({}, {
      //
    }, opts);

    this.gconfig = gconfig;
    this.runtime = new Runtime();

    this.providers = [];
    this.widgets = [];

    this.mpConnector = new MarketplaceConnector();

    this.loadProviders();
    this.loadWidgets();

    this.loadMarketplaceProviders();
    this.loadMarketplaceActions();
  }

  loadProviders() {
    const enabledProviders = [
      "generic",
      "executionControl",
      ...this.gconfig.get("ui.stencil.enabledProviders")
    ];

    const providers = clone(allProviders).filter(
      p => enabledProviders.includes(p.name)
    );

    this.runtime.set("state.stencil.providers", providers);
  }

  loadMarketplaceProviders() {
    const enabledProviders = [
      // Do we want to add something here? "Top blueprints"? "Newest"?
      ...this.gconfig.get("ui.stencil.enabledProviders")
    ];

    const providers = clone(allProviders).filter(
      p => enabledProviders.includes(p.name)
    );

    this.runtime.set("state.stencil.marketplaceProviders", providers);
  }

  selectProvider(provider) {
    this.gconfig.set("ui.stencil.selectedProvider", provider);
    this.loadWidgets();
  }

  marketplaceSelectProvider(provider) {
    this.gconfig.set("ui.stencil.marketplaceSelectedProvider", provider);
    this.loadMarketplaceActions();
  }

  setFilter(filter) {
    this.runtime.set("state.stencil.actionsFilter", filter);
    this.loadWidgets();
  }

  marketplaceSetFilter(filter) {
    this.runtime.set("state.stencil.marketplaceActionsFilter", filter);
    this.loadMarketplaceActions();
  }

  matchesFilter(action) {
    let keyword = this.runtime.get("state.stencil.actionsFilter");
    if(!keyword) return true;

    let tags = action.tags;
    tags.push(action.label);

    keyword = keyword.toLowerCase();
    keyword = keyword.replace(/[^a-z0-9\s]/g, "");
    const terms = keyword.split(" ");

    return terms.every(term => tags.some(t => t.toLowerCase().includes(term)));
  }

  loadWidgets() {
    const actions = [];

    // Maybe the user selected a providers? In this case we should show only the
    // actions from that provider
    const selectedProvider = this.gconfig.get("ui.stencil.selectedProvider");

    this.runtime.get("state.stencil.providers").forEach(provider => {
      if(selectedProvider && provider.name != selectedProvider) {
        return;
      }

      provider.actions.forEach(action => {
        if(action.type === "ddGroup") {
          action.provider = provider.name;
          action.ddWidgets.forEach(action => {
            action.provider = provider.name;
          });

          // TODO: Do we want this to be configurable?

          // First option: filter actions inside groups, but keep the groups (if
          // not empty)
          /*
          const ddWidgets = [];
          action.ddWidgets.forEach(action => {
            if(this.matchesFilter(action.ddWidget)) {
              ddWidgets.push(action);
            }
          });
          if(ddWidgets.length) {
            action.ddWidgets = ddWidgets;
            actions.push(action);
          }
          //
          */

          // Second option: filter actions and flatten them, removing the groups
          const ddWidgets = [];
          action.ddWidgets.forEach(action => {
            if(this.matchesFilter(action.ddWidget)) {
              ddWidgets.push(action);
            }
          });
          if(ddWidgets.length === action.ddWidgets.length) {
            actions.push(action);
          } else {
            ddWidgets.forEach(action => actions.push(action));
          }
          //
        } else {
          action.provider = provider.name;
          if(this.matchesFilter(action.ddWidget)) {
            actions.push(action);
          }
        }
      });
    });

    this.runtime.set("state.stencil.actions", actions);
  }

  loadMarketplaceActions() {
    // Maybe the user selected a providers? In this case we should use it in the
    // request to the marketplace
    const provider = this.gconfig.get("ui.stencil.marketplaceSelectedProvider");

    // Maybe the user is trying to filter?
    const searchTerm = this.runtime.get("state.stencil.marketplaceActionsFilter");

    this.mpConnector.getBlueprints({ searchTerm, provider }).then(data => {
      this.runtime.set("state.stencil.marketplaceActions", data.results || []);
    }).catch(() => {
      this.runtime.set("state.stencil.marketplaceActions", []);
    });
  }
}
