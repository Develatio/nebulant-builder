import { FindImageGenerator } from "./FindImageGenerator";

export class FindImagesGenerator extends FindImageGenerator {
  static PROVIDER = "aws";
  static ID = "find-images";

  constructor() {
    super();
    this.action = "find_images";
  }
}
