import { describe, it, expect } from "vitest";
import { f, safeParse, parse, SchemaValidationError } from "./index";
import type { Infer } from "./types";

describe("f.string", () => {
  it("accepts any string when no rules are set", () => {
    expect(safeParse(f.string(), "abc").success).toBe(true);
    expect(safeParse(f.string(), "").success).toBe(true);
  });

  it("required() rejects empty / null / undefined", () => {
    const s = f.string().required();
    expect(safeParse(s, "").success).toBe(false);
    expect(safeParse(s, null).success).toBe(false);
    expect(safeParse(s, undefined).success).toBe(false);
    expect(safeParse(s, "x").success).toBe(true);
  });

  it("rejects wrong type", () => {
    const r = safeParse(f.string(), 42);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.issues[0].code).toBe("type");
  });

  it("min()/max() enforce length", () => {
    const s = f.string().min(3).max(5);
    expect(safeParse(s, "ab").success).toBe(false);
    expect(safeParse(s, "abcdef").success).toBe(false);
    expect(safeParse(s, "abcd").success).toBe(true);
  });

  it("email() uses a pragmatic regex", () => {
    const s = f.string().email();
    expect(safeParse(s, "foo@bar.com").success).toBe(true);
    expect(safeParse(s, "not-an-email").success).toBe(false);
    expect(safeParse(s, "a@b").success).toBe(false);
  });

  it("url() accepts parseable URLs", () => {
    const s = f.string().url();
    expect(safeParse(s, "https://a.com").success).toBe(true);
    expect(safeParse(s, "not a url").success).toBe(false);
  });

  it("regex() enforces pattern", () => {
    const s = f.string().regex(/^[A-Z]+$/);
    expect(safeParse(s, "ABC").success).toBe(true);
    expect(safeParse(s, "abc").success).toBe(false);
  });

  it("oneOf() narrows the allowed set", () => {
    const s = f.string().oneOf(["red", "green", "blue"] as const);
    expect(safeParse(s, "red").success).toBe(true);
    expect(safeParse(s, "purple").success).toBe(false);
  });

  it("refine() runs a custom rule", () => {
    const s = f.string().refine((v) =>
      v.startsWith("ok-") ? true : "Must start with ok-",
    );
    expect(safeParse(s, "ok-123").success).toBe(true);
    const bad = safeParse(s, "nope");
    expect(bad.success).toBe(false);
    if (!bad.success) expect(bad.issues[0].message).toBe("Must start with ok-");
  });

  it("chain is immutable — old instances don't gain new rules", () => {
    const a = f.string();
    const b = a.required();
    expect(safeParse(a, "").success).toBe(true);
    expect(safeParse(b, "").success).toBe(false);
  });
});

describe("f.number", () => {
  it("rejects NaN + non-number types", () => {
    expect(safeParse(f.number(), NaN).success).toBe(false);
    expect(safeParse(f.number(), "12").success).toBe(false);
  });

  it("min/max enforce bounds", () => {
    const s = f.number().min(0).max(100);
    expect(safeParse(s, -1).success).toBe(false);
    expect(safeParse(s, 50).success).toBe(true);
    expect(safeParse(s, 101).success).toBe(false);
  });

  it("int() enforces integers", () => {
    expect(safeParse(f.number().int(), 3.5).success).toBe(false);
    expect(safeParse(f.number().int(), 3).success).toBe(true);
  });

  it("positive() enforces > 0", () => {
    expect(safeParse(f.number().positive(), 0).success).toBe(false);
    expect(safeParse(f.number().positive(), 1).success).toBe(true);
  });
});

describe("f.boolean", () => {
  it("accepts booleans only", () => {
    expect(safeParse(f.boolean(), true).success).toBe(true);
    expect(safeParse(f.boolean(), false).success).toBe(true);
    expect(safeParse(f.boolean(), "true").success).toBe(false);
    expect(safeParse(f.boolean(), 1).success).toBe(false);
  });
});

describe("f.array", () => {
  it("rejects non-arrays", () => {
    expect(safeParse(f.array(f.string()), "not array").success).toBe(false);
  });

  it("validates each item against the inner schema", () => {
    const r = safeParse(f.array(f.string()), ["a", 1, "c"]);
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.issues).toHaveLength(1);
      expect(r.issues[0].path).toEqual([1]);
      expect(r.issues[0].code).toBe("type");
    }
  });

  it("min()/max() enforce item count", () => {
    const s = f.array(f.string()).min(1).max(2);
    expect(safeParse(s, []).success).toBe(false);
    expect(safeParse(s, ["a"]).success).toBe(true);
    expect(safeParse(s, ["a", "b", "c"]).success).toBe(false);
  });
});

describe("f.object", () => {
  it("validates each field by key", () => {
    const s = f.object({
      name: f.string().required(),
      age: f.number().min(0),
    });
    const r = safeParse(s, { name: "", age: -1 });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.issues).toHaveLength(2);
      const codes = r.issues.map((i) => i.code).sort();
      expect(codes).toEqual(["min", "required"]);
    }
  });

  it("paths point to nested fields", () => {
    const s = f.object({
      user: f.object({ email: f.string().email().required() }),
    });
    const r = safeParse(s, { user: { email: "nope" } });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.issues[0].path).toEqual(["user", "email"]);
      expect(r.issues[0].code).toBe("email");
    }
  });

  it("allows extra keys by default", () => {
    const s = f.object({ a: f.string() });
    expect(safeParse(s, { a: "x", b: "extra" }).success).toBe(true);
  });

  it("strict() rejects unknown keys", () => {
    const s = f.object({ a: f.string() }).strict();
    const r = safeParse(s, { a: "x", b: "extra" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.issues[0].code).toBe("unknown");
  });

  it("cross-field refine() can attach error to a specific path", () => {
    const s = f
      .object({
        password: f.string().min(8),
        confirm: f.string(),
      })
      .refine(
        (v) =>
          v.password === v.confirm
            ? true
            : { message: "Must match password", path: ["confirm"] },
      );
    const r = safeParse(s, { password: "abcdefgh", confirm: "nope1234" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.issues[0].path).toEqual(["confirm"]);
      expect(r.issues[0].message).toBe("Must match password");
    }
  });

  it("refine() only runs when shape validation passed", () => {
    const s = f
      .object({ a: f.string().required(), b: f.string() })
      .refine(() => ({ message: "don't fire", path: ["a"] }));
    const r = safeParse(s, { a: "", b: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      // Only the required issue, refine skipped.
      expect(r.issues).toHaveLength(1);
      expect(r.issues[0].code).toBe("required");
    }
  });
});

describe("parse() vs safeParse()", () => {
  it("safeParse returns ok or issues", () => {
    const ok = safeParse(f.string(), "x");
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data).toBe("x");
  });

  it("parse() throws SchemaValidationError with issues attached", () => {
    expect(() => parse(f.string().required(), "")).toThrowError(
      SchemaValidationError,
    );
    try {
      parse(f.string().required(), "");
    } catch (e) {
      expect(e).toBeInstanceOf(SchemaValidationError);
      expect((e as SchemaValidationError).issues).toHaveLength(1);
    }
  });
});

describe("type inference", () => {
  it("Infer<S> compiles to the right shape", () => {
    const schema = f.object({
      name: f.string().required(),
      age: f.number(),
      tags: f.array(f.string()),
      admin: f.boolean(),
    });
    type User = Infer<typeof schema>;
    // Runtime asserts are just smoke — the real check is that this
    // file typechecks.
    const u: User = { name: "a", age: 1, tags: ["x"], admin: true };
    expect(u.name).toBe("a");
  });
});
