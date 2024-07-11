import { useState, useEffect } from "react";

import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";

export const Providers = () => {
  const runtime = new Runtime();
  const gconfig = new GConfig();
  const stencil = runtime.get("objects.stencil");

  const [
    selectedProvider,
    setSelectedProvider
  ] = useState(gconfig.get("ui.stencil.selectedProvider"));

  const [
    providers,
    setProviders
  ] = useState(runtime.get("state.stencil.providers"));

  useEffect(() => {
    gconfig.notifyOnChanges("ui.stencil.selectedProvider", setSelectedProvider);
    runtime.notifyOnChanges("state.stencil.providers", setProviders);

    return () => {
      gconfig.stopNotifying("ui.stencil.selectedProvider", setSelectedProvider);
      runtime.stopNotifying("state.stencil.providers", setProviders);
    }
  }, []);

  return (
    <div className="providers">
      {
        providers.map(provider => {
          const selected = selectedProvider == provider.name;

          return (
            <div
              key={provider.name}
              data-name={provider.name}
              className={`d-flex provider pointer ${provider.name} ${selected ? "selected" : ""}`}
              onClick={() => {
                if(selected) {
                  stencil.selectProvider("");
                } else {
                  stencil.selectProvider(provider.name);
                }
              }}
            />
          );
        })
      }
    </div>
  );
}
