import { traverse } from "@src/utils/lang/traverse";

export const scrub = (obj) => {
  traverse(obj).forEach(function (v) {
    if(this.isLeaf) {
      if(typeof v == "string") {
        this.update("");
      } else if(typeof v == "number") {
        this.update(0);
      }
    }
  });

  return JSON.stringify(obj);
}
