import type { Language, StringStream, TokenType } from "../types";

const JAVA_KEYWORDS = new Set([
  "abstract", "assert", "break", "case", "catch", "class", "const",
  "continue", "default", "do", "else", "enum", "extends", "final",
  "finally", "for", "goto", "if", "implements", "import", "instanceof",
  "interface", "native", "new", "package", "private", "protected",
  "public", "return", "static", "strictfp", "super", "switch",
  "synchronized", "this", "throw", "throws", "transient", "try",
  "volatile", "while", "yield",
  // Contextual / restricted keywords.
  "var", "record", "sealed", "permits", "non-sealed",
]);

const JAVA_TYPES = new Set([
  "boolean", "byte", "char", "double", "float", "int", "long", "short",
  "void",
  "String", "Object", "Integer", "Long", "Double", "Float", "Boolean",
  "Character", "Byte", "Short", "Number", "Void",
  "List", "Map", "Set", "Queue", "Deque", "Collection", "Iterable",
  "Iterator", "Comparator", "Comparable",
  "ArrayList", "LinkedList", "HashMap", "HashSet", "TreeMap", "TreeSet",
  "LinkedHashMap", "LinkedHashSet", "ArrayDeque", "PriorityQueue",
  "Optional", "Stream", "IntStream", "LongStream", "DoubleStream",
  "Throwable", "Exception", "RuntimeException", "Error", "Throwable",
  "Thread", "Runnable", "Callable", "Future", "CompletableFuture",
]);

const JAVA_BUILTINS = new Set([
  "true", "false", "null",
  "System", "Math", "Arrays", "Collections", "Objects", "String",
]);

interface JavaState {
  inBlockComment: boolean;
  /** Inside a text block (`"""…"""`) — these span multiple lines. */
  inTextBlock: boolean;
}

function readBlockComment(stream: StringStream, state: JavaState): TokenType {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.inBlockComment = false;
      return "comment";
    }
    stream.next();
  }
  return "comment";
}

function readTextBlock(stream: StringStream, state: JavaState): TokenType {
  while (!stream.eol()) {
    if (stream.match('"""', true)) {
      state.inTextBlock = false;
      return "string";
    }
    const ch = stream.next();
    if (ch === "\\" && !stream.eol()) {
      stream.next();
    }
  }
  return "string";
}

function readString(stream: StringStream, quote: string): TokenType {
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\") {
      if (stream.eol()) return "string";
      stream.next();
      continue;
    }
    if (ch === quote) return "string";
  }
  return "string";
}

function readNumber(stream: StringStream): TokenType {
  if (stream.match(/0[xX][0-9a-fA-F_]+[lL]?/, true)) return "number";
  if (stream.match(/0[bB][01_]+[lL]?/, true)) return "number";
  // Octal: 0[0-7_]+ (but only when followed by digit/end, not 0.x).
  stream.match(
    /\d[\d_]*(\.[\d_]*)?([eE][+-]?\d+)?[fFdDlL]?/,
    true,
  );
  return "number";
}

function readAnnotation(stream: StringStream): TokenType {
  // `@` already consumed in caller; read the dotted name.
  stream.eatWhile(/[A-Za-z0-9_.]/);
  return "meta";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_$]/);
  const word = stream.current();
  if (JAVA_KEYWORDS.has(word)) return "keyword";
  if (JAVA_TYPES.has(word)) return "type";
  if (JAVA_BUILTINS.has(word)) return "variable";
  // ALL_CAPS — a constant (final static).
  if (/^[A-Z][A-Z0-9_]+$/.test(word) && word.length > 1) return "variable";
  if (/^[A-Z]/.test(word)) return "type";
  const rest = stream.line.slice(stream.pos);
  if (/^\s*\(/.test(rest)) return "function";
  return "variable";
}

export function javaLang(): Language<JavaState> {
  return {
    name: "java",
    aliases: ["java"],
    startState(): JavaState {
      return { inBlockComment: false, inTextBlock: false };
    },
    token(stream, state): TokenType | null {
      if (state.inBlockComment) return readBlockComment(stream, state);
      if (state.inTextBlock) return readTextBlock(stream, state);

      if (stream.eatSpace()) return null;
      const ch = stream.peek();
      if (!ch) return null;

      if (stream.match("//", true)) {
        stream.skipToEnd();
        return "comment";
      }
      if (stream.match("/*", true)) {
        state.inBlockComment = true;
        return readBlockComment(stream, state);
      }

      // Text block must precede plain string check.
      if (stream.match('"""', true)) {
        state.inTextBlock = true;
        return readTextBlock(stream, state);
      }
      if (ch === '"') {
        stream.next();
        return readString(stream, '"');
      }
      if (ch === "'") {
        stream.next();
        return readString(stream, "'");
      }

      if (ch === "@") {
        stream.next();
        return readAnnotation(stream);
      }

      if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
        return readNumber(stream);
      }

      if (/[A-Za-z_$]/.test(ch)) {
        return readIdentifier(stream);
      }

      if (/[+\-*/%=<>!&|^~?]/.test(ch)) {
        stream.next();
        stream.eatWhile(/[+\-*/%=<>!&|^~?]/);
        return "operator";
      }
      if (/[[\](){},.:;]/.test(ch)) {
        stream.next();
        return "punctuation";
      }

      stream.next();
      return null;
    },
    lineComment: "//",
    blockComment: { open: "/*", close: "*/" },
    bracketPairs: [["(", ")"], ["[", "]"], ["{", "}"]],
    autoCloseMap: {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
    },
    electricInput: /[{}()[\]]/,
  };
}
