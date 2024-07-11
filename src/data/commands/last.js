export const last = ({res}) => {
  return res?.length > 0 ? res[res.length - 1] : null;
}
