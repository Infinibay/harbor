import { describe, it, expect } from "vitest";
import { formatMessage } from "./parse";

describe("formatMessage — interpolation", () => {
  it("returns plain text unchanged", () => {
    expect(formatMessage("hello", {}, "en")).toBe("hello");
  });

  it("replaces {name} placeholders", () => {
    expect(formatMessage("Hi, {name}!", { name: "Ada" }, "en")).toBe("Hi, Ada!");
  });

  it("replaces multiple placeholders", () => {
    expect(
      formatMessage("{greeting}, {name}!", { greeting: "Bonjour", name: "Ada" }, "en"),
    ).toBe("Bonjour, Ada!");
  });

  it("emits empty string for missing vars", () => {
    expect(formatMessage("Hi, {name}!", {}, "en")).toBe("Hi, !");
  });

  it("stringifies numbers", () => {
    expect(formatMessage("{n}", { n: 42 }, "en")).toBe("42");
  });
});

describe("formatMessage — plural", () => {
  const tmpl =
    "{count, plural, one {# item} other {# items}}";

  it("picks `one` for 1 (en)", () => {
    expect(formatMessage(tmpl, { count: 1 }, "en")).toBe("1 item");
  });

  it("picks `other` for 3 (en)", () => {
    expect(formatMessage(tmpl, { count: 3 }, "en")).toBe("3 items");
  });

  it("picks `other` for 0 (en — no `zero` branch in English)", () => {
    expect(formatMessage(tmpl, { count: 0 }, "en")).toBe("0 items");
  });

  it("honours `=N` exact-match branches ahead of plural rules", () => {
    const with0 =
      "{count, plural, =0 {none} one {one} other {many}}";
    expect(formatMessage(with0, { count: 0 }, "en")).toBe("none");
    expect(formatMessage(with0, { count: 1 }, "en")).toBe("one");
    expect(formatMessage(with0, { count: 5 }, "en")).toBe("many");
  });

  it("picks `other` when locale rule key is missing", () => {
    const onlyOther = "{count, plural, other {#}}";
    expect(formatMessage(onlyOther, { count: 7 }, "en")).toBe("7");
  });
});

describe("formatMessage — select", () => {
  const tmpl =
    "{gender, select, male {him} female {her} other {them}}";

  it("picks the matching branch", () => {
    expect(formatMessage(tmpl, { gender: "male" }, "en")).toBe("him");
    expect(formatMessage(tmpl, { gender: "female" }, "en")).toBe("her");
  });

  it("falls back to `other` for unknown values", () => {
    expect(formatMessage(tmpl, { gender: "unknown" }, "en")).toBe("them");
  });
});

describe("formatMessage — nested", () => {
  it("mixes interpolation with plural", () => {
    const tmpl =
      "{name}, you have {count, plural, one {# message} other {# messages}}.";
    expect(
      formatMessage(tmpl, { name: "Ada", count: 3 }, "en"),
    ).toBe("Ada, you have 3 messages.");
  });
});

describe("formatMessage — locale-aware numbers inside #", () => {
  it("formats the count per locale (en)", () => {
    const tmpl = "{count, plural, other {#}}";
    expect(formatMessage(tmpl, { count: 1234 }, "en")).toBe("1,234");
  });

  it("formats the count per locale (es)", () => {
    const tmpl = "{count, plural, other {#}}";
    // Spanish uses "." as the thousands separator, but Intl only kicks
    // in at 5 digits (the "1234" corner case is unformatted). Use a
    // number where every locale we care about DOES group.
    const out = formatMessage(tmpl, { count: 1234567 }, "es");
    expect(out).toBe("1.234.567");
  });
});
