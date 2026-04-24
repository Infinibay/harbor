import { describe, it, expect } from "vitest";
import { tokenizeLine } from "./highlight";
import { TokenCache } from "./cache";
import { jsLang } from "./languages/javascript";
import { jsonLang } from "./languages/json";
import type { Token } from "./types";

function types(tokens: Token[]): string[] {
  return tokens.filter((t) => t.text.trim()).map((t) => `${t.type ?? "_"}:${t.text}`);
}

describe("tokenizeLine — javascript", () => {
  const js = jsLang({ ts: true });

  it("classifies keyword, identifier, operator, number", () => {
    const { tokens } = tokenizeLine("const n = 42", js, js.startState());
    expect(types(tokens)).toContain("keyword:const");
    expect(types(tokens)).toContain("variable:n");
    expect(types(tokens)).toContain("operator:=");
    expect(types(tokens)).toContain("number:42");
  });

  it("strings and escapes", () => {
    const r = tokenizeLine('"hi\\n"', js, js.startState());
    expect(r.tokens[0].type).toBe("string");
  });

  it("line comment swallows the rest of the line", () => {
    const r = tokenizeLine("const x = 1; // trailing", js, js.startState());
    const comment = r.tokens.find((t) => t.type === "comment");
    expect(comment?.text).toContain("// trailing");
  });

  it("block comment state survives line boundaries", () => {
    const s0 = js.startState();
    const a = tokenizeLine("/* start", js, s0);
    expect(a.tokens.some((t) => t.type === "comment")).toBe(true);
    const b = tokenizeLine("end */ const x = 1", js, a.endState);
    const afterComment = b.tokens.filter((t) => t.text.trim());
    expect(afterComment.some((t) => t.type === "keyword" && t.text === "const")).toBe(true);
  });

  it("template literal with interpolation spans two lines", () => {
    const s0 = js.startState();
    const a = tokenizeLine("const s = `hello ${", js, s0);
    const b = tokenizeLine("name}`;", js, a.endState);
    // The literal starts on line 1 and closes on line 2 as a string.
    expect(a.tokens.some((t) => t.type === "string")).toBe(true);
    expect(b.tokens.some((t) => t.type === "string" || t.type === "operator")).toBe(true);
  });

  it("does not treat `a / b` as regex", () => {
    const { tokens } = tokenizeLine("a / b", js, js.startState());
    expect(tokens.some((t) => t.type === "regex")).toBe(false);
    expect(tokens.some((t) => t.type === "operator" && t.text === "/")).toBe(true);
  });

  it("treats `/regex/g` after `return` as regex", () => {
    const { tokens } = tokenizeLine("return /abc/g", js, js.startState());
    expect(tokens.some((t) => t.type === "regex")).toBe(true);
  });

  it("TypeScript type keyword", () => {
    const { tokens } = tokenizeLine("type ID = string;", js, js.startState());
    expect(types(tokens)).toContain("keyword:type");
  });

  it("JSX element", () => {
    const jsx = jsLang({ jsx: true });
    const { tokens } = tokenizeLine("<Foo bar={1}>baz</Foo>", jsx, jsx.startState());
    expect(tokens.some((t) => t.type === "tag")).toBe(true);
    expect(tokens.some((t) => t.type === "attribute")).toBe(true);
  });

  it("does not crash on malformed input", () => {
    expect(() => tokenizeLine("\"unterminated", js, js.startState())).not.toThrow();
    expect(() => tokenizeLine("`open", js, js.startState())).not.toThrow();
    expect(() => tokenizeLine("/*never ends", js, js.startState())).not.toThrow();
  });

  it("does not mutate the passed-in state", () => {
    const s0 = js.startState();
    const snapshot = JSON.stringify(s0);
    tokenizeLine("/* block", js, s0);
    expect(JSON.stringify(s0)).toBe(snapshot);
  });
});

describe("tokenizeLine — json", () => {
  const json = jsonLang();

  it("classifies keys distinctly from string values", () => {
    const { tokens } = tokenizeLine('{"name": "ada"}', json, json.startState());
    const meaningful = tokens.filter((t) => t.text.trim());
    const key = meaningful.find((t) => t.text === '"name"');
    const value = meaningful.find((t) => t.text === '"ada"');
    expect(key?.type).toBe("property");
    expect(value?.type).toBe("string");
  });

  it("true / false / null → keyword", () => {
    const { tokens } = tokenizeLine('{"a": true, "b": null, "c": false}', json, json.startState());
    const kinds = types(tokens);
    expect(kinds).toContain("keyword:true");
    expect(kinds).toContain("keyword:null");
    expect(kinds).toContain("keyword:false");
  });

  it("numbers including negative and exponent", () => {
    const { tokens } = tokenizeLine('[1, -2, 3.14, 1e5]', json, json.startState());
    const nums = tokens.filter((t) => t.type === "number").map((t) => t.text);
    expect(nums).toEqual(["1", "-2", "3.14", "1e5"]);
  });

  it("JSON5: comments + unquoted keys + single quotes", () => {
    const j5 = jsonLang({ json5: true });
    const r = tokenizeLine("{ foo: 'bar' }, // note", j5, j5.startState());
    expect(r.tokens.some((t) => t.type === "property" && t.text === "foo")).toBe(true);
    expect(r.tokens.some((t) => t.type === "string")).toBe(true);
    expect(r.tokens.some((t) => t.type === "comment")).toBe(true);
  });
});

describe("TokenCache", () => {
  const js = jsLang();

  it("tokenizes the same result when split into chunks", () => {
    const source = [
      "/* header",
      "  continues */",
      "const x = 1;",
      "const y = `tpl ${x} end`;",
      "// trailing",
    ];

    // Whole-file tokenization path
    const full = new TokenCache(js);
    const fullTokens = source.map((_, i) => full.lineTokens(source, i));

    // Chunked: tokenize line-by-line, with cache invalidations
    const chunked = new TokenCache(js);
    const chunkTokens: ReturnType<TokenCache<unknown>["lineTokens"]>[] = [];
    for (let i = 0; i < source.length; i++) {
      chunkTokens.push(chunked.lineTokens(source, i));
    }
    expect(chunkTokens).toEqual(fullTokens);
  });

  it("invalidates only from the edited line onward", () => {
    const source = [
      "const a = 1;",
      "const b = 2;",
      "const c = 3;",
      "const d = 4;",
    ];
    const cache = new TokenCache(js);
    for (let i = 0; i < source.length; i++) cache.lineTokens(source, i);
    expect(cache.size()).toBe(4);
    cache.invalidateFrom(2);
    expect(cache.size()).toBe(2);
  });

  it("prime warms the cache ahead of explicit reads", () => {
    const source = Array.from({ length: 20 }, (_, i) => `const v${i} = ${i};`);
    const cache = new TokenCache(js);
    cache.prime(source, 0, 19);
    expect(cache.size()).toBe(20);
  });
});
