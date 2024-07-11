import { util } from "@joint/core";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class HetznerCloudGenerator extends BaseBlueprintGenerator {
  deepClean(blueprint, opts = {}) {
    return super.deepClean(blueprint, util.merge({
      emptyStringsCleaner: false,
    }, opts));
  }
}
