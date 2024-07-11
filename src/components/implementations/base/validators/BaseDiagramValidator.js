import { get } from "lodash-es";
import { reach, ValidationError } from "yup";
import { BaseValidator } from "./BaseValidator";

export class BaseDiagramValidator extends BaseValidator {
  /*
    This method will allow you to resolve a particular (sub)schema at runtime.
    This will provide you with the final tests that will be applied to the data
    set that YUP is expected to validate.

    Once you have those tests, you'll be able to tell which validation
    conditions will be applied to a particular field.

    So, let's suppose that we have the following schema:

    object({
      isBig: boolean(),
      count: number().when("isBig", {
        is: true,
        then: schema => schema.min(5),
        otherwise: schema => schema.min(0)
      }),
    });

    ... and we have the following data:

    {
      isBig: true,
      count: 10
    }

    ... and we'd like to know which will be the value of the "min" rule that
    YUP will end up applying while validating our data.

    We could know that by calling this method the following way:

    resolveRules({
      fieldPath: "count", // use object notation for nested properties
      fieldRules: "min", // ... or an array of rules: ["min", "max"]
      data: {}, // the data object we're evaluating.
    });

    NOTE: For the "data" parameter you *must* pass an object containing the
    last part of the "fieldPath" parameter.
    TODO: This might not be necessary once https://github.com/jquense/yup/issues/1280 is fixed

    Example:

    schema = object({
      parameters: object({
        foo: number().min(10)
      }),
      output: object({
        bar: number().min(50)
      })
    });

    data = {
      parameters: {
        foo: 5,
      },
      output: {
        bar: 42,
      }
    }

    resolveRule({
      fieldPath: "parameters.foo",
      fieldRules: "min",
      data: data.parameters // <-- This is the important part
    })
  */
  resolveRules({ fieldPath, fieldRules, data, node }) {
    fieldRules = Array.isArray(fieldRules) ? fieldRules : [fieldRules];

    const defaultValues = this.getDefaultValues({}, {
      node_id: node.id,
    });
    const resolved = reach(this.schema, fieldPath).resolve({
      parent: data,
    });
    const described = resolved.describe();

    return fieldRules.map(fieldRule => {
      const res = {
        rule: fieldRule,
        value: undefined,
      };

      let test;
      switch (fieldRule) {
        case "default":
          res.value = get(defaultValues, fieldPath);
          break;

        case "min":
          test = described.tests.find(test => test.name == fieldRule);
          if(test !== undefined) {
            res.value = test.params.min;
          } else {
            res.value = get(defaultValues, fieldPath);
          }
          break;

        case "max":
          test = described.tests.find(test => test.name == fieldRule);
          if(test !== undefined) {
            res.value = test.params.max;
          } else {
            res.value = get(defaultValues, fieldPath);
          }
          break;

        case "required":
          test = described.tests.find(test => test.name == fieldRule);
          res.value = !!test;
          break;

        // TODO: Implement rules as needed
        default:
          break;
      }

      return res;
    });
  }

  async validate({ data = {}, context = {} }) {
    // Validate result
    const res = {
      warnings: {},
      errors: {},
      isValid: true,
    };

    await this.schema.validate(data, {
      // TODO: If this gets uncommented, all validation schemas must get
      // reviewed one by one, because this makes YUP strip all properties (even
      // nested properties) to get stripped BEFORE the validation is performed.
      //stripUnknown: true,
      abortEarly: false,
      context: context,
    }).then(_ => {}).catch(validationError => {
      // Check if this is an actual YUP error or if something
      // failed and we're wrongly capturing the backtrace
      if(validationError instanceof ValidationError) {
        validationError.inner.forEach(error => {
          const v = error.type == "warning" ? res.warnings : res.errors;
          (v[error.path] = v[error.path] || []).push(error);
        });

        res.isValid = Object.keys(res.errors).length == 0;
      } else {
        // Something really bad happened.
        this.logger.error("Unhandled exception while validating data.");
        this.logger.error(validationError);
        this.eventBus.publish("crash");
        res.isValid = false;
      }
    });

    return res;
  }
}
