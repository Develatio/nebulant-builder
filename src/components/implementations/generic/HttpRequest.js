import { array, boolean, object, string } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/generic/validators/_base";

import { HttpRequestSettings } from "@src/components/settings/generic/HttpRequestSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import HttpRequestIcon from "@src/assets/img/icons/generic/http-request.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        http_verb: string().default("GET").label("HTTP verb"),
        endpoint: string().default("").label("Endpoint"),
        parameters: array().of(object({
          enabled: boolean().default(true),
          name: string().default("").label("Parameter name"),
          value: string().default("").label("Parameter value"),
        })).default([]),
        headers: array().of(object({
          enabled: boolean().default(true),
          name: string().default("").label("Header name"),
          value: string().default("").label("Header value"),
        })).default([
          { enabled: true, name: "Cache-Control", value: "no-cache" },
          { enabled: true, name: "Accept", value: "*/*" },
          { enabled: true, name: "Accept-Encoding", value: "gzip, deflate, br" },
          { enabled: true, name: "Connection", value: "keep-alive" },
          { enabled: true, name: "User-Agent", value: "Nebulant" },
        ]),
        body_type: string().default("none").label("Body type"),
        body_content_type_header: string().default("text"),
        body_form_data: array().of(object({
          name: string().default("").label("Form data name"),
          value: string().default("").label("Form data value"),
          type: string().default("text"), // "text" or "file"
          content_type: string().default("").label("Form data content type"),
        })).default([]),
        body_x_www_form_urlencoded: array().of(object({
          name: string().default("").label("Form urlencoded name"),
          value: string().default("").label("Form urlencoded value"),
        })).default([]),
        body_raw: string().default("").label("RAW body"),
        body_binary: string().default("").label("Binary body"),
        ignore_invalid_certs: boolean().default(false),
        use_cookie_jar: boolean().default(false),
        cookie_jar: string().default("").label("Cookie jar name"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          type: string().default("generic:http_response"),
          value: result.fields.value.label("HTTP_RESPONSE").default("HTTP_RESPONSE"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // add "max retries"
    ["1.0.1", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],

    // add "ignore_invalid_certs"
    ["1.0.2", (data) => {
      data.settings.parameters.ignore_invalid_certs = false;

      return {
        data,
        success: true,
      };
    }],

    // add cookie jar fields
    ["1.0.3", (data) => {
      data.settings.parameters.use_cookie_jar = false;
      data.settings.parameters.cookie_jar = "";

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const HttpRequestStatic = {
  label: "HTTP request",
  icon: HttpRequestIcon,

  data: {
    id: "http-request",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const HttpRequestFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = HttpRequestSettings;
  }
};

