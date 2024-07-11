import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class HttpRequestGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "http-request";

  constructor() {
    super();
    this.action = "http_request";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        http_verb: parameters.http_verb,
        endpoint: parameters.endpoint,
        //parameters: parameters.parameters,
        headers: parameters.headers,
        body_type: parameters.body_type,
        max_retries: parameters._maxRetries,
        ignore_invalid_certs: parameters.ignore_invalid_certs,
        ...(
          parameters.use_cookie_jar ? {
            cookie_jar: parameters.cookie_jar,
          } : {
            cookie_jar: "",
          }
        ),
      },

      output: outputs.result.value,
    };

    switch (parameters.body_type) {
      case "form-data":
        blueprint.parameters.headers = blueprint.parameters.headers.filter(header => {
          return header.name.toLowerCase() != "content-type";
        });

        blueprint.parameters.headers.push({
          name: "content-type",
          value: "multipart/form-data",
        });

        // NOTE: We can't set the content-type header for the elements who's
        // type is "file". CLI must set it for us
        blueprint.parameters.body = parameters.body_form_data.map(chunk => ({
          name: chunk.name,
          value: chunk.value,
          type: chunk.type,
          content_type: chunk.type == "text" ? chunk.context_type || "text/plain" : "",
        }));
        break;

      case "x-www-form-urlencoded":
        blueprint.parameters.headers = blueprint.parameters.headers.filter(header => {
          return header.name.toLowerCase() != "content-type";
        });

        blueprint.parameters.headers.push({
          name: "content-type",
          value: "application/x-www-form-urlencoded",
        });

        blueprint.parameters.body = parameters.body_x_www_form_urlencoded;
        break;

      case "raw":
        const ct_map = {
          "text": "text/plain",
          "javascript": "application/javascript",
          "json": "application/json",
          "html": "text/html",
          "xml": "application/xml",
        }

        if(ct_map[parameters.body_content_type_header]) {
          blueprint.parameters.headers = blueprint.parameters.headers.filter(header => {
            return header.name.toLowerCase() != "content-type";
          });

          blueprint.parameters.headers.push({
            name: "content-type",
            value: ct_map[parameters.body_content_type_header],
          });
        }

        blueprint.parameters.body = parameters.body_raw;
        break;

      case "binary":
        // NOTE: We can't set the content-type header. CLI must set it for us
        blueprint.parameters.body = parameters.body_binary;
        break;
    }

    return this.deepClean(blueprint);
  }
}

