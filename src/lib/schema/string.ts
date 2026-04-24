import { defaultMessage, type ValidationCode } from "./messages";
import type { Issue, Schema, ValidateContext } from "./types";

type Rule = (value: string, ctx: ValidateContext) => Issue | null;

/** Immutable chain-builder for string schemas. Each method returns a
 *  new instance with an appended rule — chains compose predictably
 *  without mutation. */
export class StringSchema implements Schema<string> {
  readonly _type = "string";
  declare readonly _output: string;
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
  }): StringSchema {
    return new StringSchema({
      rules: patch.rules ?? this.rules,
      isRequired: patch.isRequired ?? this.isRequired,
      requiredMsg:
        patch.requiredMsg !== undefined ? patch.requiredMsg : this.requiredMsg,
    });
  }

  required(message?: string): StringSchema {
    return this.derive({ isRequired: true, requiredMsg: message });
  }

  min(n: number, message?: string): StringSchema {
    return this.addRule((value, ctx) =>
      value.length < n
        ? issue(ctx, "minLength", message ?? defaultMessage("minLength", { min: n }))
        : null,
    );
  }

  max(n: number, message?: string): StringSchema {
    return this.addRule((value, ctx) =>
      value.length > n
        ? issue(ctx, "maxLength", message ?? defaultMessage("maxLength", { max: n }))
        : null,
    );
  }

  email(message?: string): StringSchema {
    return this.addRule((value, ctx) =>
      !EMAIL_RE.test(value)
        ? issue(ctx, "email", message ?? defaultMessage("email"))
        : null,
    );
  }

  url(message?: string): StringSchema {
    return this.addRule((value, ctx) => {
      try {
        new URL(value);
        return null;
      } catch {
        return issue(ctx, "url", message ?? "Enter a valid URL");
      }
    });
  }

  regex(pattern: RegExp, message?: string): StringSchema {
    return this.addRule((value, ctx) =>
      pattern.test(value)
        ? null
        : issue(ctx, "regex", message ?? "Invalid format"),
    );
  }

  oneOf<const L extends string>(
    values: readonly L[],
    message?: string,
  ): StringSchema {
    return this.addRule((value, ctx) =>
      (values as readonly string[]).includes(value)
        ? null
        : issue(
            ctx,
            "oneOf",
            message ?? `Must be one of: ${values.join(", ")}`,
          ),
    );
  }

  /** Synchronous custom refinement. Return `true` to accept, or a string
   *  message to reject with that text. */
  refine(
    fn: (value: string) => true | string,
    code: ValidationCode = "refine",
  ): StringSchema {
    return this.addRule((value, ctx) => {
      const r = fn(value);
      return r === true ? null : issue(ctx, code, r);
    });
  }

  private addRule(rule: Rule): StringSchema {
    return this.derive({ rules: [...this.rules, rule] });
  }

  validate(value: unknown, ctx: ValidateContext): Issue[] {
    if (value === undefined || value === null || value === "") {
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
    if (typeof value !== "string") {
      return [issue(ctx, "type", "Expected a string")];
    }
    const out: Issue[] = [];
    for (const r of this.rules) {
      const i = r(value, ctx);
      if (i) out.push(i);
    }
    return out;
  }
}

// Pragmatic email regex — good enough for form validation, not RFC 5322.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function issue(
  ctx: ValidateContext,
  code: ValidationCode,
  message: string,
): Issue {
  return { path: ctx.path, code, message };
}
