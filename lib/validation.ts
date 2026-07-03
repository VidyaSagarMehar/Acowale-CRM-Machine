import { ZodError } from "zod";

export function getZodErrorMessages(error: ZodError) {
  return error.issues.map((issue) => issue.message);
}
