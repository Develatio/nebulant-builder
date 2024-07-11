import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class SendEmailGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "send-email";

  constructor() {
    super();
    this.action = "send_email";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        username: parameters.username,
        password: parameters.password,
        server: parameters.server,
        port: parameters.port,
        ignore_invalid_ssl: parameters.ignore_invalid_ssl,
        force_ssl: parameters.force_ssl,

        from: parameters.from || parameters.username,
        to: parameters.to,
        cc: parameters.cc,
        bcc: parameters.bcc,
        reply_to: parameters.reply_to || parameters.from,
        subject: parameters.subject,
        body: parameters.body,
        attachments: parameters.attachments.map(attachment => attachment.value),

        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}

