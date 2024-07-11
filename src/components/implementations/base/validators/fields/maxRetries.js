import { object, number } from "yup";

export const maxRetries = object({
  _maxRetries: number().min(0).max(1000).label("Max retries").default(5),
});
