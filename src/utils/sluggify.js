export const sluggify = s => {
  s = s.replace(/ +/g, "-");
  s = s.replace(/[^-a-zA-Z0-9_]/g, "");
  return s.toLocaleLowerCase();
}
