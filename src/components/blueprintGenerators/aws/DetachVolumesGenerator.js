import { DetachVolumeGenerator } from "./DetachVolumeGenerator";

export class DetachVolumesGenerator extends DetachVolumeGenerator {
  static PROVIDER = "aws";
  static ID = "detach-volumes";

  constructor() {
    super();
    this.action = "detach_volumes";
  }
}
