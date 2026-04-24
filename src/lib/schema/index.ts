import { StringSchema } from "./string";
import { NumberSchema } from "./number";
import { BooleanSchema } from "./boolean";
import { ArraySchema } from "./array";
import { ObjectSchema, type ShapeMap } from "./object";
import type { Schema } from "./types";

/** Ergonomic factory for Harbor schemas.
 *
 *  ```ts
 *  const user = f.object({
 *    email: f.string().email().required(),
 *    age:   f.number().min(18).max(120),
 *    tags:  f.array(f.string()).min(1),
 *  });
 *  ```
 *
 *  Schemas are immutable — every chain method returns a new instance. */
export const f = {
  string: (): StringSchema => new StringSchema(),
  number: (): NumberSchema => new NumberSchema(),
  boolean: (): BooleanSchema => new BooleanSchema(),
  array: <T>(of: Schema<T>): ArraySchema<T> => new ArraySchema(of),
  object: <S extends ShapeMap>(shape: S): ObjectSchema<S> =>
    new ObjectSchema(shape),
};

export { StringSchema } from "./string";
export { NumberSchema } from "./number";
export { BooleanSchema } from "./boolean";
export { ArraySchema } from "./array";
export { ObjectSchema } from "./object";
export type { InferShape } from "./object";
export { defaultMessage, keyForCode } from "./messages";
export type { ValidationCode } from "./messages";
export {
  runValidate,
  safeParse,
  parse,
  SchemaValidationError,
} from "./types";
export type {
  Infer,
  Issue,
  Path,
  SafeParseErr,
  SafeParseOk,
  SafeParseResult,
  Schema,
  ValidateContext,
} from "./types";
