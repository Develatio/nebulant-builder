export const _tags = (value, context) => {
  if(["$", "?"].some(c => value.value[0].includes(c))) {
    return context.createError({
      type: "warning",
      path: `${context.path}.value`,
      message: "The tag key doesn't seem to be valid",
      params: {
        position: 0,
      }
    });
  }

  return true;
}
