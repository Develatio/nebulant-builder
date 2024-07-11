import { DeleteSecurityGroupGenerator } from "./DeleteSecurityGroupGenerator";

export class DeleteSecurityGroupsGenerator extends DeleteSecurityGroupGenerator {
  static PROVIDER = "aws";
  static ID = "delete-security-groups";

  constructor() {
    super();
    this.action = "delete_securitygroups";
  }
}
