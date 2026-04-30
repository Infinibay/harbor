# YAMLConfigEditor

Lightweight YAML editor — a `<textarea>` overlaid with line numbers,
per-line error dots, and a tiny built-in linter (indent unit, tabs,
required / disallowed top-level keys). For real parsing wire your own
parser and feed errors via `errors`.

## Import

```tsx
import { YAMLConfigEditor } from "@infinibay/harbor/dev";
```

## Example

```tsx
const [text, setText] = useState(initial);

<YAMLConfigEditor
  value={text}
  onChange={setText}
  schema={{
    requiredKeys: ["service", "version"],
    disallowedKeys: ["legacyAuth"],
    indent: 2,
  }}
  errors={externalErrors}  // merged with built-ins
  height={320}
/>;
```

When `readOnly` is set, the component falls back to a syntax-highlighted
`<CodeBlock lang="yaml">`.

## YAMLError

```ts
{
  line: number;             // 1-based
  column?: number;
  message: string;
  severity?: "error" | "warning";
}
```

## YAMLSchemaShape

```ts
{
  requiredKeys?: string[];
  disallowedKeys?: string[];
  indent?: 2 | 4;
}
```

## Props

- **value** — `string`. Required.
- **onChange** — `(next: string) => void`.
- **readOnly** — `boolean`. Renders `<CodeBlock>` instead of the editor.
- **schema** — `YAMLSchemaShape`. Built-in lint rules.
- **errors** — `readonly YAMLError[]`. External errors, merged with the
  built-in ones (deduped by line+message at render time).
- **height** — `number`. Pixel height. Default `280`.
- **header** — `ReactNode`. Optional header slot above the editor.
- **className** — extra classes on the wrapper.

## Notes

- The built-in linter is intentionally minimal: indent multiples, tabs,
  required / disallowed top-level keys. It is **not** a parser — for
  type checking, anchor resolution, or schema validation use a real
  YAML library and inject results via `errors`.
- Errors are listed in a row below the editor; each line gets a colored
  dot in the gutter (rose for errors, amber for warnings).
