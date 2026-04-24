export type {
  Language,
  StringStream,
  Token,
  TokenType,
  Diagnostic,
} from "./types";
export { Stream } from "./stream";
export { tokenizeLine } from "./highlight";
export type { TokenizeLineResult } from "./highlight";
export { TokenCache } from "./cache";
export { jsLang, type JavaScriptOptions } from "./languages/javascript";
export { jsonLang, type JsonOptions } from "./languages/json";
