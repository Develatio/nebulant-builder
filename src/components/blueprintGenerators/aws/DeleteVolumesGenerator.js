import { DeleteVolumeGenerator } from "./DeleteVolumeGenerator";

export class DeleteVolumesGenerator extends DeleteVolumeGenerator {
  static PROVIDER = "aws";
  static ID = "delete-volumes";

  constructor() {
    super();
    this.action = "delete_volumes";
  }
}
