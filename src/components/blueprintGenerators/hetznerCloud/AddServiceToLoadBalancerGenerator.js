import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class AddServiceToLoadBalancerGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "add-service-to-load-balancer";

  constructor() {
    super();
    this.action = "add_service_to_load_balancer";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        load_balancer: {
          ID: parameters.LoadBalancerIds[0],
        },

        opts: {
          Protocol: parameters.Protocol[0],
          ListenPort: parameters.SrcPort,
          DestinationPort: parameters.DstPort,

          HealthCheck: {
            Protocol: parameters.HealthCheck.Protocol[0],
            Port: parameters.HealthCheck.Port,
            Interval: parameters.HealthCheck.Interval,
            Timeout: parameters.HealthCheck.Timeout,
            Retries: parameters.HealthCheck.Retries,

            ...(parameters.HealthCheck.Protocol[0] === "http" ? {
              HTTP: {
                Domain: parameters.HealthCheck.HTTP.Domain,
                Path: parameters.HealthCheck.HTTP.Path,
                Response: parameters.HealthCheck.HTTP.Response,
                StatusCodes: parameters.HealthCheck.HTTP.StatusCodes.split(",").map(
                  s => s.trim()
                ).filter(s => s),
                TLS: parameters.HealthCheck.HTTP.TLS,
              },
            } : {})
          },

          Proxyprotocol: parameters.Proxyprotocol,

          ...(parameters.Protocol[0] === "http" ? {
            HTTP: {
              CookieName: parameters.HTTP.CookieName,
              CookieLifetime: parameters.HTTP.CookieLifetime,
              StickySessions: parameters.HTTP.StickySessions,

              //RedirectHTTP: // <-- We can't have this until we implement HTTPS
            },
          } : {}),
        },

        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
