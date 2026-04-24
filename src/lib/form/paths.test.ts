import { describe, it, expect } from "vitest";
import { getByPath, pathToString, setByPath, stringToPath } from "./paths";

describe("stringToPath / pathToString", () => {
  it("splits on dots and parses numeric segments", () => {
    expect(stringToPath("")).toEqual([]);
    expect(stringToPath("a")).toEqual(["a"]);
    expect(stringToPath("a.b.c")).toEqual(["a", "b", "c"]);
    expect(stringToPath("tags.0.name")).toEqual(["tags", 0, "name"]);
  });

  it("round-trips through pathToString", () => {
    expect(pathToString(stringToPath("user.email"))).toBe("user.email");
    expect(pathToString(stringToPath("tags.0"))).toBe("tags.0");
  });
});

describe("getByPath", () => {
  it("reads nested fields", () => {
    const o = { user: { email: "a@b.com" }, tags: ["x", "y"] };
    expect(getByPath(o, ["user", "email"])).toBe("a@b.com");
    expect(getByPath(o, ["tags", 1])).toBe("y");
  });

  it("returns undefined for missing segments", () => {
    expect(getByPath({}, ["a", "b"])).toBeUndefined();
    expect(getByPath(null, ["a"])).toBeUndefined();
  });
});

describe("setByPath", () => {
  it("sets a top-level field immutably", () => {
    const o = { a: 1, b: 2 };
    const next = setByPath(o, ["a"], 99);
    expect(next).toEqual({ a: 99, b: 2 });
    expect(o).toEqual({ a: 1, b: 2 });
    expect(next).not.toBe(o);
  });

  it("sets a nested field and clones the spine", () => {
    const o = { user: { email: "a@b.com", name: "Ada" } };
    const next = setByPath(o, ["user", "email"], "x@y.com");
    expect(next.user.email).toBe("x@y.com");
    expect(next.user.name).toBe("Ada");
    expect(next).not.toBe(o);
    expect(next.user).not.toBe(o.user);
  });

  it("creates missing intermediate objects / arrays", () => {
    const o = {} as Record<string, unknown>;
    const next = setByPath(o, ["user", "email"], "a@b.com");
    expect(next).toEqual({ user: { email: "a@b.com" } });

    const arr = setByPath({}, ["tags", 0, "name"], "x");
    expect(arr).toEqual({ tags: [{ name: "x" }] });
  });

  it("sets array indices immutably", () => {
    const o = { tags: ["a", "b", "c"] };
    const next = setByPath(o, ["tags", 1], "B");
    expect(next.tags).toEqual(["a", "B", "c"]);
    expect(next.tags).not.toBe(o.tags);
  });
});
