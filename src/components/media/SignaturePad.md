# SignaturePad

Pointer-driven canvas for collecting signatures. Emits the result as
a `data:` PNG URL on stroke end. Includes a built-in Clear button and
"Sign here" empty hint.

## Import

```tsx
import { SignaturePad } from "@infinibay/harbor/media";
```

## Example

```tsx
const [sig, setSig] = useState<string | null>(null);

<SignaturePad
  width={480}
  height={180}
  color="#fff"
  strokeWidth={2}
  onChange={setSig}
/>
```

## Props

- **width** — `number`. Pixel width. Default `480`.
- **height** — `number`. Pixel height. Default `180`.
- **color** — `string`. Stroke color. Default `"#fff"`.
- **strokeWidth** — `number`. Line thickness. Default `2`.
- **onChange** — `(dataUrl: string \| null) => void`. Fires after
  every stroke (with the PNG data URL) and on Clear (with `null`).
- **className** — extra classes on the wrapper.

## Notes

- The canvas is rendered at `devicePixelRatio` for crisp output on
  high-DPI screens; the visible CSS size stays at `width` / `height`.
- Pointer capture means the stroke continues even when the cursor
  leaves the canvas.
- Output PNG includes only the visible canvas — no chrome, no
  background. Compose your own framing on the parent if needed.
