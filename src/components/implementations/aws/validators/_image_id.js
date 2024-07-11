export const _image_id = (value, context) => {
  if(value.value && !value.value.match(/^ami-[a-f,0-9]{8}$/)) {
    return context.createError({
      type: "warning",
      path: `${context.path}.value`,
      message: "The value doesn't look like a valid Image ID.",
    });
  }

  return true;
}
