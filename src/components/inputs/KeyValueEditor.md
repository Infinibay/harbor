# KeyValueEditor

`KeyValueEditor` is an inline editor for environment variables, metadata, headers, labels, and configuration maps. It supports add, remove, reorder, secret-value detection, custom header content, and controlled state.

Use it when users need to manage a small ordered list of key/value pairs without leaving the current form.

## Import

```tsx
import {
  KeyValueEditor,
  type KeyValuePair,
} from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { KeyValueEditor, type KeyValuePair } from "@infinibay/harbor/inputs";

export function EnvEditor() {
  const [pairs, setPairs] = useState<KeyValuePair[]>([
    { id: "api-url", key: "API_URL", value: "https://api.acme.co" },
    { id: "token", key: "SERVICE_TOKEN", value: "" },
  ]);

  return (
    <KeyValueEditor
      value={pairs}
      onChange={setPairs}
      header={<div className="text-sm font-medium">Environment variables</div>}
    />
  );
}
```

## Secret Detection

Values whose keys match `/secret|token|key|password|apikey|api_key/i` render with `SecretsInput`.

```tsx
<KeyValueEditor
  value={pairs}
  onChange={setPairs}
  secret={(key) => key.startsWith("PRIVATE_") || key.endsWith("_TOKEN")}
/>
```

## Props

- **value**: `readonly KeyValuePair[]`. Required controlled rows.
- **onChange**: `(next: KeyValuePair[]) => void`. Required update callback.
- **secret**: `(key: string) => boolean`. Overrides secret detection.
- **keyPlaceholder**: `string`. Defaults to `"KEY"`.
- **valuePlaceholder**: `string`. Defaults to `"value"`.
- **hideAddButton**: `boolean`. Removes the add-row button.
- **header**: `ReactNode`. Slot above the editor.
- **className**: custom class on the wrapper.

## Accessibility

Key and value inputs expose labels. Remove and drag handles are buttons. Drag reordering is pointer-based, so provide another ordering workflow if order is critical for keyboard-only users.

## Gotchas

- The component is fully controlled. Every edit emits a new array through `onChange`.
- Generated ids use time plus randomness. For persisted rows, store stable ids from your model.
- Reorder uses document queries for rows marked `data-kv-row`; keep multiple editors reasonably separated in complex pages.
- `SecretsInput` is chosen from the current key string. Renaming a key can change the value control type.

## Related

- [`SecretsInput`](./SecretsInput.md) for masked values.
- [`Form`](./Form.md) for surrounding form structure.
- [`PropertyList`](../display/PropertyList.md) for read-heavy key/value details.
