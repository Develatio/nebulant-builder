export const castToInt = (v) => {
  try {
    const nv = parseInt(v, 10);
    if(!isNaN(nv)) {
      v = nv;
    }
  } catch (_) {
    // no-op
  }

  return v;
}
