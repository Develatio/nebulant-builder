import { util } from "@joint/core";
import cleaner from "fast-clean";

import { MIN_CLI_VERSION } from "@src/utils/constants";

export class BaseBlueprintGenerator {
  constructor() {
    this.action = "";
    this.min_cli_version = MIN_CLI_VERSION;
  }

  getAction() {
    return this.action;
  }

  getMinCliVersion() {
    return this.min_cli_version;
  }

  deepClean(blueprint, opts = {}) {
    return cleaner.clean(blueprint, util.merge({
      nullCleaner: true,
      emptyArraysCleaner: true,
      emptyObjectsCleaner: true,
      emptyStringsCleaner: true,
      nanCleaner: true,
      cleanInPlace: false,
    }, opts));
  }
}
