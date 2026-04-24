import type { Issue, Schema, ValidateContext } from "./types";

export type ShapeMap = Record<string, Schema<unknown>>;

/** Resolve an object shape's output type by unwrapping the phantom
 *  `_output` of each field's schema. */
export type InferShape<S extends ShapeMap> = {
  [K in keyof S]: S[K] extends Schema<infer T> ? T : never;
};

type Refinement<T> = {
  fn: (value: T) => true | string | { message: string; path?: ReadonlyArray<string | number> };
  code: string;
};

export class ObjectSchema<S extends ShapeMap> implements Schema<InferShape<S>> {
  readonly _type = "object";
  declare readonly _output: InferShape<S>;
  readonly shape: S;
  private readonly refinements: readonly Refinement<InferShape<S>>[];
  private readonly allowExtra: boolean;

  constructor(
    shape: S,
    opts?: {
      refinements?: readonly Refinement<InferShape<S>>[];
      allowExtra?: boolean;
    },
  ) {
    this.shape = shape;
    this.refinements = opts?.refinements ?? [];
    this.allowExtra = opts?.allowExtra ?? true;
  }

  /** Cross-field refinement. Receives the parsed object; return `true`
   *  to accept, a string message, or `{ message, path }` to attach the
   *  error to a specific field. */
  refine(
    fn: Refinement<InferShape<S>>["fn"],
    code = "refine",
  ): ObjectSchema<S> {
    return new ObjectSchema(this.shape, {
      refinements: [...this.refinements, { fn, code }],
      allowExtra: this.allowExtra,
    });
  }

  /** Reject objects with keys not declared in the shape. Off by default
   *  so partial UI state (extra metadata on a values object) doesn't
   *  fail blindly. */
  strict(): ObjectSchema<S> {
    return new ObjectSchema(this.shape, {
      refinements: this.refinements,
      allowExtra: false,
    });
  }

  validate(value: unknown, ctx: ValidateContext): Issue[] {
    if (value === undefined || value === null || typeof value !== "object") {
      return [
        { path: ctx.path, code: "type", message: "Expected an object" },
      ];
    }
    const obj = value as Record<string, unknown>;
    const issues: Issue[] = [];

    for (const key of Object.keys(this.shape)) {
      const fieldSchema = this.shape[key];
      issues.push(
        ...fieldSchema.validate(obj[key], {
          path: [...ctx.path, key],
        }),
      );
    }

    if (!this.allowExtra) {
      for (const k of Object.keys(obj)) {
        if (!(k in this.shape)) {
          issues.push({
            path: [...ctx.path, k],
            code: "unknown",
            message: `Unknown key: ${k}`,
          });
        }
      }
    }

    // Apply cross-field refinements only when the shape itself is valid
    // — a refinement that depends on e.g. `password === confirm` can't
    // fire meaningfully if one of the fields failed its own check.
    if (issues.length === 0) {
      for (const ref of this.refinements) {
        const r = ref.fn(obj as InferShape<S>);
        if (r === true) continue;
        if (typeof r === "string") {
          issues.push({ path: ctx.path, code: ref.code, message: r });
        } else {
          issues.push({
            path: r.path ? [...ctx.path, ...r.path] : ctx.path,
            code: ref.code,
            message: r.message,
          });
        }
      }
    }

    return issues;
  }
}
