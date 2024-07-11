import { ReleaseAddressGenerator } from "./ReleaseAddressGenerator";

export class ReleaseAddressesGenerator extends ReleaseAddressGenerator {
  static PROVIDER = "aws";
  static ID = "release-addresses";

  constructor() {
    super();
    this.action = "release_addresses";
  }
}
