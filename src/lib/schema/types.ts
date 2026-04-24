export type Path = ReadonlyArray<string | number>;

export interface Issue {
  /** Dot-like path to the failing field. Empty for root-level issues. */
  path: Path;
  /** Stable machine-readable code (`"required"`, `"min"`, `"email"`, …).
   *  Useful for programmatic handling / UI branching. */
  code: string;
  /** Already-resolved user-facing message. Schemas translate via the
   *  i18n catalog under `harbor.validation.*` when no override is
   *  provided, so the default message respects the active locale. */
  message: string;
}

export interface ValidateContext {
  path: Path;
}

/** A schema validates an `unknown` input against a shape and produces
 *  issues (empty array = valid). `_output` is a phantom property used
 *  by `Infer<S>` — it never carries a runtime value. */
export interface Schema<T> {
  readonly _type: string;
  readonly _output: T;
  validate(value: unknown, ctx: ValidateContext): Issue[];
}

export type Infer<S> = S extends Schema<infer T> ? T : never;

export interface SafeParseOk<T> {
  success: true;
  data: T;
}
export interface SafeParseErr {
  success: false;
  issues: Issue[];
}
export type SafeParseResult<T> = SafeParseOk<T> | SafeParseErr;

export class SchemaValidationError extends Error {
  issues: Issue[];
  constructor(issues: Issue[]) {
    super(
      `Schema validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"})`,
    );
    this.issues = issues;
  }
}

/** Shared validate/parse/safeParse helpers — attached to every built
 *  schema so they all share the same calling convention. */
export function runValidate<T>(
  schema: Schema<T>,
  value: unknown,
): Issue[] {
  return schema.validate(value, { path: [] });
}

export function safeParse<T>(
  schema: Schema<T>,
  value: unknown,
): SafeParseResult<T> {
  const issues = runValidate(schema, value);
  if (issues.length === 0) return { success: true, data: value as T };
  return { success: false, issues };
}

export function parse<T>(schema: Schema<T>, value: unknown): T {
  const r = safeParse(schema, value);
  if (r.success) return r.data;
  throw new SchemaValidationError(r.issues);
}
