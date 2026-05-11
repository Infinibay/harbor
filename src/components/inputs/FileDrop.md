# FileDrop

`FileDrop` gives users a drag-and-drop upload target backed by a native file
input. It supports click-to-browse, drag-over feedback, accepted file hints,
single or multiple selection, a local selected-file list, and an `onFiles`
callback for handing files to your application.

Use it for import flows, avatar uploads, release artifacts, logs, screenshots,
CSV files, disk images, and any workflow where the browser should collect local
files before your app uploads or validates them.

## Import

```tsx
import { FileDrop } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
<FileDrop
  accept=".csv,text/csv"
  hint="Drop a CSV export"
  multiple={false}
  onFiles={(files) => importCsv(files[0])}
/>;
```

For multiple artifacts:

```tsx
<FileDrop
  accept=".tgz,.sha256"
  hint="Drop release artifact and checksum"
  onFiles={(files) => queueUploads(files)}
/>;
```

## Props

- **onFiles** - `(files: File[]) => void`. Called with files selected or dropped
  in the latest interaction.
- **accept** - `string`. Native file input accept string, such as `"image/*"` or
  `".iso,.qcow2"`.
- **multiple** - `boolean`. Allows multiple selection and appends selected files
  to the local preview list. Default `true`.
- **hint** - `string`. Main drop-zone copy. Default
  `"Drag files or click to browse"`.
- **className** - extra classes on the wrapper.

## Behavior

When files are dropped or selected, Harbor stores a local preview list and calls
`onFiles` with the new files from that interaction. In multiple mode, the local
preview list appends and keeps the latest eight files. In single mode, it
replaces the list with the latest selection.

The component does not upload files, read file contents, or validate size. It
only collects `File` objects from the browser.

## Accessibility

The drop target is a label wrapping a native file input, so click-to-browse works
without drag and drop. Keep `hint` specific to the expected file type, and
display validation errors outside the component when a file is rejected by your
app.

Drag-and-drop should be a shortcut, not the only path. The native file picker is
the accessible fallback.

## Gotchas

- The `accept` attribute is a browser hint, not security validation. Validate
  MIME type, extension, and file contents on the server.
- `onFiles` receives only the files from the latest interaction, while the visual
  list may show accumulated files in multiple mode.
- The local preview list is capped at eight files.
- Clearing uploaded files is not built in; control that state in the parent if
  the workflow needs removal.

## Related

- `SignaturePad` for pointer-captured signatures.
- `FormSection` for import forms.
- `Progress` for upload progress.
- `Alert` for validation errors.
