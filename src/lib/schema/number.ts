import { defaultMessage, type ValidationCode } from "./messages";
import type { Issue, Schema, ValidateContext } from "./types";

type Rule = (value: number, ctx: ValidateContext) => Issue | null;

export class NumberSchema implements Schema<number> {
  readonly _type = "number";
  declare readonly _output: number;
  private rules: readonly Rule[];
  private isRequired: boolean;
  private requiredMsg?: string;

  constructor(opts?: {
    rules?: readonly Rule[];
    isRequired?: boolean;
    requiredMsg?: string;
  }) {
    this.rules = opts?.rules ?? [];
    this.isRequired = opts?.isRequired ?? false;
    this.requiredMsg = opts?.requiredMsg;
  }

  private derive(patch: {
    rules?: readonly Rule[];
    isRequired?: boolean;
    requiredMsg?: string;
  }): NumberSchema {
    return new NumberSchema({
      rules: patch.rules ?? this.rules,
      isRequired: patch.isRequired ?? this.isRequired,
      requiredMsg:
        patch.requiredMsg !== undefined ? patch.requiredMsg : this.requiredMsg,
    });
  }

  required(message?: string): NumberSchema {
    return this.derive({ isRequired: true, requiredMsg: message });
  }

  min(n: number, message?: string): NumberSchema {
    return this.addRule((value, ctx) =>
      value < n
        ? issue(ctx, "min", message ?? defaultMessage("min", { min: n }))
        : null,
    );
  }

  max(n: number, message?: string): NumberSchema {
    return this.addRule((value, ctx) =>
      value > n
        ? issue(ctx, "max", message ?? defaultMessage("max", { max: n }))
        : null,
    );
  }

  int(message?: string): NumberSchema {
    return this.addRule((value, ctx) =>
      Number.isInteger(value)
        ? null
        : issue(ctx, "type", message ?? "Must be an integer"),
    );
  }

  positive(message?: string): NumberSchema {
    return this.addRule((value, ctx) =>
      value > 0 ? null : issue(ctx, "min", message ?? "Must be positive"),
    );
  }

  refine(
    fn: (value: number) => true | string,
    code: ValidationCode = "refine",
  ): NumberSchema {
    return this.addRule((value, ctx) => {
      const r = fn(value);
      return r === true ? null : issue(ctx, code, r);
    });
  }

  private addRule(rule: Rule): NumberSchema {
    return this.derive({ rules: [...this.rules, rule] });
  }

  validate(value: unknown, ctx: ValidateContext): Issue[] {
    if (value === undefined || value === null || (value as unknown) === "") {
      if (this.isRequired) {
        return [
          issue(
            ctx,
            "required",
            this.requiredMsg ?? defaultMessage("required"),
          ),
        ];
      }
      return [];
    }
    if (typeof value !== "number" || Number.isNaN(value)) {
      return [issue(ctx, "type", "Expected a number")];
    }
    const out: Issue[] = [];
    for (const r of this.rules) {
      const i = r(value, ctx);
      if (i) out.push(i);
    }
    return out;
  }
}

function issue(
  ctx: ValidateContext,
  code: ValidationCode,
  message: string,
): Issue {
  return { path: ctx.path, code, message };
}
