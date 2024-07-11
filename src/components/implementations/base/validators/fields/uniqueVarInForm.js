// This validator is useful only for the DefineVariablesSettings component

export const uniqueVarInForm = {
  name: "warning",
  message: "This action will overwrite a variable that has been already defined.",
  test: (value, context) => {
    // If no value was passed, there's nothing we can check.
    if(!value) {
      return true;
    }

    // If neither context or form were passed, there's nothing we can check.
    if(!context.options?.context || !context.options.context?.form) {
      return true;
    }

    const { form } = context.options.context;
    return form.get("parameters.vars").filter(v => v.name === value).length <= 1;
  }
};
