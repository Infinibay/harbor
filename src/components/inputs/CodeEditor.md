# CodeEditor

`CodeEditor` is Harbor's lightweight textarea-backed code editor. It layers a
native textarea over a syntax-highlighted pre, preserving browser editing
behavior while adding line numbers, diagnostics, bracket matching, find/replace,
indentation helpers, comments, line movement, duplication, and auto-close pairs.

Use it for config editors, SQL snippets, YAML settings, JSON payloads, markdown,
small scripts, and product demos. For a full IDE, integrate Monaco or CodeMirror.

## Import

```tsx
import { CodeEditor } from "@infinibay/harbor/inputs";
```

## Basic Usage

Pass a Harbor language definition and an accessible label.

```tsx
<CodeEditor
  ariaLabel="Deployment YAML"
  language={yamlLanguage}
  value={yaml}
  onChange={setYaml}
  height={360}
/>
```

## Diagnostics

Diagnostics appear in the gutter, underline the affected range, and are announced
through a hidden live region.

```tsx
<CodeEditor
  ariaLabel="Policy JSON"
  language={jsonLanguage}
  diagnostics={[
    { severity: "error", line: 4, column: 12, message: "Expected string value" },
  ]}
/>
```

## Editing Features

The editor supports Tab indent/dedent, auto-indent on Enter, bracket pair
insertion, line comments, move/duplicate/delete line shortcuts, select next
match, and built-in find/replace.

## Props

- `value`, `defaultValue`, `onChange`: controlled or uncontrolled text.
- `language`: required syntax language.
- `ariaLabel`: required accessible label.
- `tabSize`, `insertSpaces`, `autoIndent`, `autoClose`: editing behavior.
- `readOnly`, `placeholder`, sizing props.
- `showLineNumbers`: gutter visibility.
- `diagnostics`: validation messages.
- Standard textarea props except controlled value props.

## Accessibility

Because it uses a native textarea, IME, paste, undo, selection, and screen reader
basics remain platform-driven. Always pass `ariaLabel`. Diagnostics are exposed
as `aria-errormessage` when errors exist.

## Gotchas

This is not a virtual IDE. It is best for focused editing surfaces, not huge
repositories or language-server workflows.

The highlight layer is visual; the textarea remains the source of truth.

## Related

- `YAMLConfigEditor` for YAML-specific config editing.
- `CodeBlock` for read-only examples.
- `FindBar` for separate find controls.
- `Textarea` for plain long-form text.
