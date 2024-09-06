import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class UploadFilesGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "upload-files";

  constructor() {
    super();
    this.action = "upload_files";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        // Files
        paths: parameters.paths?.map(obj => obj.value),

        // Target
        username: parameters.username,
        port: parameters.port,
        target: parameters.target?.[0], // "{{ ... }}" or IP addr

        ...(parameters._credentials == "privkeyPath" && { privkeyPath: parameters.privkeyPath }),
        ...(parameters._credentials == "privkeyPath" && { passphrase: parameters.passphrase }),

        ...(parameters._credentials == "privkey" && { privkey: parameters.privkey }),
        ...(parameters._credentials == "privkey" && { passphrase: parameters.passphrase }),

        ...(parameters._credentials == "password" && { password: parameters.password }),

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

        max_retries: parameters._maxRetries,
      },
    };

    return this.deepClean(blueprint);
  }
}

