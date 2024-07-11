import { Logger } from "@src/core/Logger";
import { EventBus } from "@src/core/EventBus";
import { clone } from "@src/utils/lang/clone";

export class BaseValidator {
  constructor() {
    this.logger = new Logger();
    this.eventBus = new EventBus();
  }

  getDefaultValues(settings = {}, context = {}) {
    let defaultValues = this.schema.cast(settings);

    try {
      defaultValues = this.schema.validateSync(defaultValues, {
        context,
        abortEarly: false,
      });
    } catch (error) {
      if(error.value) {
        defaultValues = error.value;
      } else {
        this.logger.critical("Something really bad happened while trying to generate default settings");
        this.logger.error(error);
        defaultValues = settings;
      }
    }

    // This is required because of https://github.com/jquense/yup/issues/1386
    return clone(defaultValues);
  }
}
