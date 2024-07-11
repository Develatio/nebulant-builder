import { boolean, string, object, lazy, array } from "yup";
import { BaseValidator } from "./BaseValidator";
import { randomizeOutputName } from "./fields/randomizeOutputName";

export class SettingsStructureValidator extends BaseValidator {
  constructor(opts = {}) {
    super();
    if(opts.dont_randomize_output_name) {
      this.dont_randomize_output_name = true;
    }

    this.schema = object({
      info: string().default(""),
      parameters: object().default({}),
      outputs: lazy(details => {
        if(!details) return object();

        return object(
          Object.fromEntries(
            Object.keys(details).map(key => [
              key,
              object({
                value: (() => {
                  if(this.dont_randomize_output_name) {
                    return string().default("Result");
                  } else {
                    return string().default("Result").transform(randomizeOutputName);
                  }
                })(),
                //value: string().default("Result").transform(randomizeOutputName),
                type: string().default(""),
                capabilities: array().default([]),
                async: boolean().default(false),
                waiters: array().default([]),
              }),
            ])
          )
        );
      }),
    });
  }
}
