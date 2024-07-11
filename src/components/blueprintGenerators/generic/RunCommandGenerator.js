import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class RunCommandGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "run-command";

  constructor() {
    super();
    this.action = "run_script";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        // Command settings
        entrypoint: parameters.entrypoint,

        ...(parameters._type === "script" && {
          // Content of the embedded script
          pass_to_entrypoint_as_single_param: parameters.pass_to_entrypoint_as_single_param,
          scriptParameters: parameters.scriptParameters,
          script: parameters.script,
          scriptName: parameters.scriptName,
        }),

        ...(parameters._type === "command" && {
          // A single command
          command: parameters.command,
        }),

        // Target
        target: parameters._run_on_remote ? parameters.target?.[0] : "local", // "local",  "{{ ... }}" or IP addr
        ...(parameters._run_on_remote && {
          username: parameters.username,
          port: parameters.port,

          ...(parameters._credentials == "privkeyPath" && { privkeyPath: parameters.privkeyPath }),
          ...(parameters._credentials == "privkeyPath" && { passphrase: parameters.passphrase }),

          ...(parameters._credentials == "privkey" && { privkey: parameters.privkey }),
          ...(parameters._credentials == "privkey" && { passphrase: parameters.passphrase }),

          ...(parameters._credentials == "password" && { password: parameters.password }),

          upload_to_remote_target: parameters.upload_to_remote_target,
        }),

        // Proxies
        proxies: parameters.proxies.map(proxy => ({
          username: proxy.value.username,
          target: proxy.value.target?.[0],
          port: proxy.value.port,

          ...(proxy.value._credentials == "privkeyPath" && { privkeyPath: proxy.value.privkeyPath }),
          ...(proxy.value._credentials == "privkeyPath" && { passphrase: proxy.value.passphrase }),

          ...(proxy.value._credentials == "privkey" && { privkey: proxy.value.privkey }),
          ...(proxy.value._credentials == "privkey" && { passphrase: proxy.value.passphrase }),

          ...(proxy.value._credentials == "password" && { password: proxy.value.password }),
        })),

        // Debug options
        open_dbg_shell_before: parameters.open_dbg_shell_before,
        open_dbg_shell_after: parameters.open_dbg_shell_after,
        open_dbg_shell_onerror: parameters.open_dbg_shell_onerror,

        // Expose variables to ENV
        vars: parameters.vars.reduce((acc, { value }) => {
          acc[value.name] = value.value;
          return acc;
        }, {}),

        // Dump variables to JSON
        dump_json: parameters.dump_json,

        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
