# YAMLConfigEditor

`YAMLConfigEditor` is a lightweight YAML editing surface for configuration panels, deployment manifests, feature flags, and infrastructure settings. It renders a textarea with line numbers, line-level error markers, basic linting, and an optional read-only code view.

It is not a full YAML parser. Use it for quick config editing, and feed parser or server validation errors through `errors` when strict correctness matters.

## Import

```tsx
import {
  YAMLConfigEditor,
  type YAMLError,
  type YAMLSchemaShape,
} from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
import { useState } from "react";
import { YAMLConfigEditor } from "@infinibay/harbor/dev";

export function DeployConfig() {
  const [value, setValue] = useState(`name: api
replicas: 3
image: acme/api:latest`);

  return (
    <YAMLConfigEditor
      value={value}
      onChange={setValue}
      schema={{
        requiredKeys: ["name", "image"],
        disallowedKeys: ["latestDeprecated"],
        indent: 2,
      }}
      header={<div className="text-sm font-medium">deploy.yaml</div>}
    />
  );
}
```

## External Errors

```tsx
<YAMLConfigEditor
  value={yaml}
  onChange={setYaml}
  errors={[
    { line: 4, column: 12, message: "Unknown resource type", severity: "error" },
    { line: 8, message: "Deprecated key", severity: "warning" },
  ]}
/>
```

Built-in lint errors and external errors are merged before rendering.

## Props

- **value**: `string`. Required YAML text.
- **onChange**: `(next: string) => void`. Optional edit callback.
- **readOnly**: `boolean`. Renders `CodeBlock` instead of the editor.
- **schema**: `YAMLSchemaShape`. Light validation for required/disallowed top-level keys and indent unit.
- **errors**: `readonly YAMLError[]`. Additional validation messages.
- **height**: `number`. Editor height in pixels. Defaults to `280`.
- **header**: `ReactNode`. Slot above the editor.
- **className**: custom class on the wrapper.

## Accessibility

The textarea is labelled. Errors are repeated as text below the editor instead of relying only on line-number dots. Keep critical validation messages close to the save/apply action as well.

## Gotchas

- Built-in validation is intentionally shallow: indentation, tabs, top-level required keys, and disallowed keys.
- Flow-style YAML detection is rough. Use a real YAML parser for strict validation.
- `readOnly` switches to `CodeBlock`, so editing callbacks are ignored in that mode.
- The editor does not sync scroll positions between textarea and line numbers beyond matching line height.

## Related

- [`CodeBlock`](./CodeBlock.md) for read-only snippets.
- [`CodeEditor`](./CodeEditor.md) for richer code editing.
- [`KeyValueEditor`](../inputs/KeyValueEditor.md) for structured config maps.
