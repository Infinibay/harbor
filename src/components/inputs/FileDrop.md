# FileDrop

A drag-and-drop file picker with a click-to-browse fallback, an
animated upload icon, and a running list of accepted files. Use it
whenever you'd otherwise wire `<input type="file">` plus drag
events by hand — for avatars, attachments, ISO uploads, etc.

## Import

```tsx
import { FileDrop } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<FileDrop
  accept=".iso,.qcow2"
  multiple={false}
  hint="Drop a disk image"
  onFiles={(files) => uploadDisk(files[0])}
/>
```

## Props

- **onFiles** — `(files: File[]) => void`. Called with the dropped or
  picked files.
- **accept** — `string`. Standard `<input accept>` filter (e.g.
  `".png,.jpg"` or `"image/*"`).
- **multiple** — `boolean`. Allow multi-select / multi-drop. Default
  `true`.
- **hint** — `string`. Body text in the resting state. Default
  `"Drag files or click to browse"`.
- **className** — extra classes on the wrapper.

## Notes

- The internal file list is capped at the 8 most recent files for
  display purposes — `onFiles` always fires with the full latest
  drop.
- The drop zone uses `data-cursor="drag"` for the custom cursor
  affordance when present.
- The icon animates while a drag is hovering and the border tint
  flips to the accent color.
