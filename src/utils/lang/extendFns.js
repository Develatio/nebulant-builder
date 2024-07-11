export const extendFns = (cls, fns) => {
  Object.entries(fns).forEach(([key, fn]) => cls.prototype[key] = fn);
}
