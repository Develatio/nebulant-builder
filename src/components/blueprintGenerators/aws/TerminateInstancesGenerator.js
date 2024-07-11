import { TerminateInstanceGenerator } from "./TerminateInstanceGenerator";

export class TerminateInstancesGenerator extends TerminateInstanceGenerator {
  static PROVIDER = "aws";
  static ID = "delete-instances";

  constructor() {
    super();
    this.action = "delete_instances";
  }
}
