import { defaultMessage } from "./messages";
import type { Issue, Schema, ValidateContext } from "./types";

export class ArraySchema<T> implements Schema<T[]> {
  readonly _type = "array";
  declare readonly _output: T[];
  private readonly itemSchema: Schema<T>;
  private minItems?: number;
  private maxItems?: number;
  private minMsg?: string;
  private maxMsg?: string;
  private isRequired: boolean;
  private requiredMsg?: string;

  constructor(
    itemSchema: Schema<T>,
    opts?: {
      minItems?: number;
      maxItems?: number;
      minMsg?: string;
      maxMsg?: string;
      isRequired?: boolean;
      requiredMsg?: string;
    },
  ) {
    this.itemSchema = itemSchema;
    this.minItems = opts?.minItems;
    this.maxItems = opts?.maxItems;
    this.minMsg = opts?.minMsg;
    this.maxMsg = opts?.maxMsg;
    this.isRequired = opts?.isRequired ?? false;
    this.requiredMsg = opts?.requiredMsg;
  }

  private derive(
    patch: Partial<{
      minItems: number;
      maxItems: number;
      minMsg: string;
      maxMsg: string;
      isRequired: boolean;
      requiredMsg: string;
    }>,
  ): ArraySchema<T> {
    return new ArraySchema(this.itemSchema, {
      minItems: patch.minItems ?? this.minItems,
      maxItems: patch.maxItems ?? this.maxItems,
      minMsg: patch.minMsg ?? this.minMsg,
      maxMsg: patch.maxMsg ?? this.maxMsg,
      isRequired: patch.isRequired ?? this.isRequired,
      requiredMsg: patch.requiredMsg ?? this.requiredMsg,
    });
  }

  required(message?: string): ArraySchema<T> {
    return this.derive({ isRequired: true, requiredMsg: message });
  }

  min(n: number, message?: string): ArraySchema<T> {
    return this.derive({ minItems: n, minMsg: message });
  }

  max(n: number, message?: string): ArraySchema<T> {
    return this.derive({ maxItems: n, maxMsg: message });
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
    if (!Array.isArray(value)) {
      return [
        { path: ctx.path, code: "type", message: "Expected an array" },
      ];
    }
    const issues: Issue[] = [];
    if (this.minItems !== undefined && value.length < this.minItems) {
      issues.push({
        path: ctx.path,
        code: "minLength",
        message:
          this.minMsg ?? `Must have at least ${this.minItems} item(s)`,
      });
    }
    if (this.maxItems !== undefined && value.length > this.maxItems) {
      issues.push({
        path: ctx.path,
        code: "maxLength",
        message:
          this.maxMsg ?? `Must have at most ${this.maxItems} item(s)`,
      });
    }
    value.forEach((item, i) => {
      issues.push(
        ...this.itemSchema.validate(item, {
          path: [...ctx.path, i],
        }),
      );
    });
    return issues;
  }
}
