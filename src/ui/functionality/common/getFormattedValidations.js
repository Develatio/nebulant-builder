export const getFormattedValidations = ({ form, validations, path }) => {
  let { warnings, errors } = validations;

  if(form.getTouched(path) || validations.submitted) {
    warnings = warnings[path] || [];
    errors = errors[path] || [];
  } else {
    warnings = [];
    errors = [];
  }

  return { warnings, errors };
}
