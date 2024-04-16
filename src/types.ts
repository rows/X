import { ErrorCodes } from "./error-codes";

export type ExceptionMessage = {
  code: ErrorCodes;
  message: string;
}
