import type { Issue, Schema, ValidateContext } from "../schema";
import { runValidate } from "../schema";

type PathLike = string | number | readonly (string | number)[];

interface ZodLikeIssue {
  path?: PathLike;
  code?: string;
  message?: string;
}

interface ZodLikeSchema<T> {
  safeParse(value: unknown):
    | { success: true; data: T }
    | { success: false; error: { issues: ZodLikeIssue[] } };
}

type ZodLikeParseError = {
  success: false;
  error: { issues: ZodLikeIssue[] };
};

interface StandardSchemaIssue {
  path?: PathLike | { key: string | number }[];
  message?: string;
}

interface StandardSchemaResult<T> {
  value?: T;
  issues?: readonly StandardSchemaIssue[];
}

interface StandardSchemaLike<T> {
  "~standard": {
    validate(value: unknown): StandardSchemaResult<T>;
  };
}

function toPath(path: unknown): readonly (string | number)[] {
  if (path == null) return [];
  if (typeof path === "string" || typeof path === "number") return [path];
  if (Array.isArray(path)) {
    return path.map((part) => {
      if (typeof part === "object" && part && "key" in part) {
        return (part as { key: string | number }).key;
      }
      return part as string | number;
    });
  }
  return [];
}

function prefixPath(ctx: ValidateContext, path: unknown) {
  return [...ctx.path, ...toPath(path)];
}

export function fromZod<T>(schema: ZodLikeSchema<T>): Schema<T> {
  return {
    _type: "zod",
    _output: undefined as T,
    validate(value, ctx) {
      const result = schema.safeParse(value);
      if (result.success) return [];
      const issues = (result as ZodLikeParseError).error.issues;
      return issues.map((issue): Issue => ({
        path: prefixPath(ctx, issue.path),
        code: issue.code ?? "invalid",
        message: issue.message ?? "Invalid value",
      }));
    },
  };
}

export function fromStandardSchema<T>(schema: StandardSchemaLike<T>): Schema<T> {
  return {
    _type: "standard-schema",
    _output: undefined as T,
    validate(value, ctx) {
      const result = schema["~standard"].validate(value);
      return (result.issues ?? []).map((issue): Issue => ({
        path: prefixPath(ctx, issue.path),
        code: "invalid",
        message: issue.message ?? "Invalid value",
      }));
    },
  };
}

export interface ReactHookFormResolverResult<T> {
  values: T | Record<string, never>;
  errors: Record<
    string,
    {
      type: string;
      message: string;
    }
  >;
}

export type ReactHookFormResolver<T> = (
  values: T,
) => ReactHookFormResolverResult<T> | Promise<ReactHookFormResolverResult<T>>;

export function toReactHookFormResolver<T>(
  schema: Schema<T>,
): ReactHookFormResolver<T> {
  return (values) => {
    const issues = runValidate(schema, values);
    if (issues.length === 0) {
      return { values, errors: {} };
    }

    return {
      values: {},
      errors: Object.fromEntries(
        issues.map((issue) => [
          issue.path.join("."),
          {
            type: issue.code,
            message: issue.message,
          },
        ]),
      ),
    };
  };
}
