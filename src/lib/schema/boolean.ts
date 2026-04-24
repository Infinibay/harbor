import { defaultMessage } from "./messages";
import type { Issue, Schema, ValidateContext } from "./types";

export class BooleanSchema implements Schema<boolean> {
  readonly _type = "boolean";
  declare readonly _output: boolean;
  private isRequired: boolean;
  private requiredMsg?: string;

  constructor(opts?: { isRequired?: boolean; requiredMsg?: string }) {
    this.isRequired = opts?.isRequired ?? false;
    this.requiredMsg = opts?.requiredMsg;
  }

  required(message?: string): BooleanSchema {
    return new BooleanSchema({ isRequired: true, requiredMsg: message });
  }

  validate(value: unknown, ctx: ValidateContext): Issue[] {
    if (value === undefined || value === null) {
      if (this.isRequired) {
        return [
          {
            path: ctx.path,
            code: "required",
            message:
              this.requiredMsg ?? defaultMessage("required"),
          },
        ];
      }
      return [];
    }
    if (typeof value !== "boolean") {
      return [
        { path: ctx.path, code: "type", message: "Expected a boolean" },
      ];
    }
    return [];
  }
}
