import { object, string, number, boolean, array } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/generic/validators/_base";

import { SendEmailSettings } from "@src/components/settings/generic/SendEmailSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import SendEmailIcon from "@src/assets/img/icons/generic/email.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        username: string().required().default("").label("Username"),
        password: string().required().default("").label("Password"),
        server: string().required().default("").label("SMTP server"),
        port: number().required().default(587).label("SMTP port"),
        ignore_invalid_ssl: boolean().required().default(false).label("Ignore invalid SSL certificate"),
        force_ssl: boolean().required().default(false).label("Force SSL"),

        to: array().default([]).label("To"),
        cc: array().default([]).label("CC"),
        bcc: array().default([]).label("BCC"),
        from: string().default("").label("From").test((value, context) => {
          if(value) return true;

          return context.createError({
            type: "warning",
            path: context.path,
            message: "If you leave this field empty, the 'Username' field will be used",
          });
        }),
        reply_to: string().default("").label("Reply to"),
        subject: string().default("").label("Subject"),
        body: object({
          plain: string().default("").label("Plain text"),
          html: string().default("").label("HTML"),
        }),
        attachments: array().of(object({})).default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          type: string().default("generic:smtp_response"),
          value: result.fields.value.label("Email result").default("SEND_EMAIL_RESULT"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // Migrate "to", "cc" and "bcc" to array of strings
    ["1.0.1", (data) => {

      if(typeof data.settings.parameters.to == "string") {
        data.settings.parameters.to = [data.settings.parameters.to];
      }
      if(typeof data.settings.parameters.cc == "string") {
        data.settings.parameters.cc = [data.settings.parameters.cc];
      }
      if(typeof data.settings.parameters.bcc == "string") {
        data.settings.parameters.bcc = [data.settings.parameters.bcc];
      }

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add "max retries"
    ["1.0.2", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],

    // add "attachments"
    ["1.0.3", (data) => {
      data.settings.parameters.attachments = [];

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const SendEmailStatic = {
  label: "Send email",
  icon: SendEmailIcon,

  data: {
    id: "send-email",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const SendEmailFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = SendEmailSettings;
  }
};

