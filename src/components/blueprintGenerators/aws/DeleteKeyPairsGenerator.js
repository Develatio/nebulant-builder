import { DeleteKeyPairGenerator } from "./DeleteKeyPairGenerator";

export class DeleteKeyPairsGenerator extends DeleteKeyPairGenerator {
  static PROVIDER = "aws";
  static ID = "delete-key-pairs";

  constructor() {
    super();
    this.action = "delete_keypairs";
  }
}
