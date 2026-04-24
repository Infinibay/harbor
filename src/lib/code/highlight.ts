import { Stream } from "./stream";
import type { Language, Token } from "./types";

export interface TokenizeLineResult<State> {
  tokens: Token[];
  endState: State;
}

/** Runs a language's `token()` over a single line, returning the list
 *  of classified runs plus the language state at the end of the line.
 *  The `startState` is NOT mutated (defensive copy before calling). */
export function tokenizeLine<State>(
  line: string,
  language: Language<State>,
  startState: State,
  tabSize = 2,
): TokenizeLineResult<State> {
  const copy = language.copyState ?? defaultCopyState;
  const state = copy(startState) as State;
  const stream = new Stream(line, tabSize);
  const tokens: Token[] = [];

  // Empty lines keep state stable and produce no tokens.
  if (line.length === 0) {
    return { tokens, endState: state };
  }

  let safetyBudget = line.length + 1024;
  while (!stream.eol()) {
    stream.start = stream.pos;
    const before = stream.pos;
    const type = language.token(stream, state);
    if (stream.pos === before) {
      // Mode forgot to advance — consume a single character to break
      // the deadlock rather than looping forever.
      stream.pos++;
    }
    if (--safetyBudget <= 0) {
      stream.pos = line.length;
      break;
    }
    const text = line.slice(stream.start, stream.pos);
    if (!text) continue;
    const last = tokens[tokens.length - 1];
    if (last && last.type === type && last.to === stream.start) {
      last.to = stream.pos;
      last.text += text;
    } else {
      tokens.push({
        from: stream.start,
        to: stream.pos,
        type,
        text,
      });
    }
  }
  return { tokens, endState: state };
}

function defaultCopyState<S>(state: S): S {
  if (state === null || typeof state !== "object") return state;
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(state);
    } catch {
      // fall through to JSON
    }
  }
  return JSON.parse(JSON.stringify(state)) as S;
}
