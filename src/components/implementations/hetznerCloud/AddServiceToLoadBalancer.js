import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AddServiceToLoadBalancerSettings } from "@src/components/settings/hetznerCloud/AddServiceToLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AddServiceToLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        LoadBalancerIds: array().of(string()).required().min(1).max(1).default([]).label("Load balancer ID"),
        Protocol: array().of(string()).required().min(1).max(1).default(["tcp"]).label("Protocol"),
        SrcPort: string().required().default("80").label("Source port"),
        DstPort: string().required().default("80").label("Destination port"),

        _healthCheck: boolean().default(false).label("Enable health check"),
        HealthCheck: object({
          Protocol: array().of(string()).required().min(1).max(1).default(["tcp"]).label("Protocol"),
          Port: string().required().default("80").label("Port"),
          Interval: string().test({
            test: Interval => {
              const i = parseInt(Interval, 10);
              if(isNaN(i)) {
                return true;
              }

              return i >= 3 && i <= 60;
            },
            message: "Interval must be a value between 3 and 60",
          }).required().default("15").label("Interval"),
          Timeout: string().when(["Interval"], ([Interval], schema) => {
            return schema.test({
              test: Timeout => {
                const t = parseInt(Timeout, 10);
                const i = parseInt(Interval, 10);
                if(isNaN(t) || isNaN(i)) {
                  return true;
                }

                return t <= i;
              },
              message: "Timeout must be lower than Interval",
            })
          }).required().default("10").label("Timeout"),
          Retries: string().test({
            test: Retries => {
              const r = parseInt(Retries, 10);
              if(isNaN(r)) {
                return true;
              }

              return r <= 5;
            },
            message: "Retries can't be higher than 5",
          }).required().default("3").label("Retries"),

          HTTP: object({
            TLS: boolean().default(false).label("TLS"),
            Domain: string().default("").label("Domain"),
            Path: string().default("/").label("Path"),
            StatusCodes: string().default("2??, 3??").label("Status codes"),
            Response: string().default("").label("Response"),
          }),
        }),

        Proxyprotocol: boolean().default(false).label("Proxy protocol"),

        HTTP: object({
          StickySessions: boolean().default(false).label("Sticky sessions"),
          CookieName: string().when(["StickySessions"], ([StickySessions], schema) => {
            if(StickySessions) {
              return schema.required();
            }

            return schema;
          }).default("HCLBSTICKY").label("Cookie name"),
          CookieLifetime: string().when(["StickySessions"], ([StickySessions], schema) => {
            if(StickySessions) {
              return schema.required();
            }

            return schema;
          }).default("300").label("Cookie lifetime"),
        }),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("HC_ACTION"),
          type: result.fields.type.default("hetznerCloud:action"),
          waiters: result.fields.waiters.default(["success"]),
          async: boolean().default(false),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const AddServiceToLoadBalancerStatic = {
  label: "Add service to load balancer",
  icon: AddServiceToLoadBalancerIcon,
  info: "",

  data: {
    id: "add-service-to-load-balancer",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AddServiceToLoadBalancerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AddServiceToLoadBalancerSettings;
  }
};
