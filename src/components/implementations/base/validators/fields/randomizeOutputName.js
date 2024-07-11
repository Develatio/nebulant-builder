import { DiagramQL } from "@src/data/DiagramQL";

export const randomizeOutputName = (value = "VAR") => {
  let prefix = value;
  let count = 0;
  const dql = new DiagramQL();

  while (
    dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$eqi": ${dql.escape(value)}
        }
      } | count
    `) > 0
  ) {
    count++;
    value = `${prefix}_${count}`;

    // security break
    if(count > 100) {
      const now = (new Date).getTime();
      const rand = Math.floor((now / 100)).toString().substring(6);
      value = `${prefix}_${rand}`
    }
  }

  return value;
}
