import { useState, useEffect } from "react";

import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";

export const MarketplaceFilters = () => {
  const runtime = new Runtime();
  const gconfig = new GConfig();
  const stencil = runtime.get("objects.stencil");

  const [
    selectedProvider,
    setSelectedProvider
  ] = useState(gconfig.get("ui.stencil.marketplaceSelectedProvider"));

  const [
    providers,
    setProviders
  ] = useState(runtime.get("state.stencil.marketplaceProviders"));

  useEffect(() => {
    gconfig.notifyOnChanges("ui.stencil.marketplaceSelectedProvider", setSelectedProvider);
    runtime.notifyOnChanges("state.stencil.marketplaceProviders", setProviders);

    return () => {
      gconfig.stopNotifying("ui.stencil.marketplaceSelectedProvider", setSelectedProvider);
      runtime.stopNotifying("state.stencil.marketplaceProviders", setProviders);
    }
  }, []);

  return (
    <div className="marketplaceFilters">
      {
        providers.map(provider => {
          const selected = selectedProvider == provider.name;

          return (
            <div
              key={provider.name}
              data-name={provider.name}
              className={`d-flex marketplaceFilter pointer ${provider.name} ${selected ? "selected" : ""}`}
              onClick={() => {
                if(selected) {
                  stencil.marketplaceSelectProvider("");
                } else {
                  stencil.marketplaceSelectProvider(provider.name);
                }
              }}
            />
          );
        })
      }
    </div>
  );
}
