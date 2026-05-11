# SignaturePad

`SignaturePad` captures a drawn signature on a canvas and emits a PNG data URL
when the pointer stroke completes. It is useful for approvals, delivery
confirmation, service forms, waivers, internal sign-offs, and prototype flows
where a lightweight signature capture surface is enough.

The component handles high-DPI canvas scaling, pointer capture, a clear action,
and an empty-state prompt. Your application owns validation, persistence, legal
copy, and submission.

## Import

```tsx
import { SignaturePad } from "@infinibay/harbor/media";
```

## Basic Usage

```tsx
const [signature, setSignature] = useState<string | null>(null);

<SignaturePad
  width={520}
  height={180}
  color="#ffffff"
  strokeWidth={2}
  onChange={setSignature}
/>;

<Button disabled={!signature}>Accept agreement</Button>
```

Persist the returned data URL with the rest of the form, or upload it to storage
after submit.

## Props

- **width** - `number`. Canvas display width in pixels. Default `480`.
- **height** - `number`. Canvas display height in pixels. Default `180`.
- **color** - `string`. Stroke color. Default `"#fff"`.
- **strokeWidth** - `number`. Stroke width in pixels. Default `2`.
- **onChange** - `(dataUrl: string | null) => void`. Fires with a PNG data URL
  after a stroke ends, and with `null` when cleared.
- **className** - extra classes on the wrapper.

## Behavior

On mount and whenever size or stroke settings change, Harbor sizes the backing
canvas using `devicePixelRatio` so strokes stay sharp on high-DPI displays.

Pointer down starts drawing and captures the pointer. Pointer move draws
rounded-line segments. Pointer up ends the stroke and calls `onChange` with
`canvas.toDataURL("image/png")`. Pressing `Clear` wipes the canvas, restores the
empty prompt, and calls `onChange(null)`.

## Accessibility

Canvas signature capture is pointer-first. Provide an alternate path when a user
cannot draw, such as typed name confirmation, file upload, or a checkbox backed
by your legal requirements.

Do not treat this component alone as a complete legal-signature workflow. Pair it
with clear consent text, timestamping, identity context, and backend validation
where required.

## Gotchas

- Changing `width`, `height`, `color`, or `strokeWidth` resets canvas state
  because the backing canvas is recreated.
- The component emits a data URL, which can be large. Convert or upload it
  outside the component if your backend expects files.
- Drawing is not undoable. Users can only clear and redraw.

## Related

- `FileDrop` for uploaded signature or document evidence.
- `Form` and `FieldSet` for approval forms.
- `Button` for submit and clear actions around the pad.
- `Alert` for legal or validation warnings.
