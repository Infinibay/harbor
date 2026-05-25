# HarborForm

Schema-driven form orchestration for product forms that need validation, autosave, server errors, field arrays, and multi-step flows without locking the app into one external form runtime.

## Import

```tsx
import {
  HarborForm,
  HarborField,
  useAsyncFieldValidation,
  useFieldArray,
  useFormAutosave,
  useFormDirtyGuard,
  useFormWizard,
  useServerErrors,
  fromStandardSchema,
  fromZod,
  toReactHookFormResolver,
} from "@infinibay/harbor/form";
```

## Example

```tsx
import { Button } from "@infinibay/harbor/buttons";
import { TextField } from "@infinibay/harbor/inputs";
import { f } from "@infinibay/harbor/schema";
import {
  HarborField,
  HarborForm,
  useAsyncFieldValidation,
  useFieldArray,
  useFormAutosave,
  useFormDirtyGuard,
  useFormWizard,
} from "@infinibay/harbor/form";

const accountSchema = f.object({
  email: f.string().email().required(),
  displayName: f.string().min(2).required(),
  domains: f.array(f.string()),
});

function AccountSettingsForm({ initial, saveAccount, checkEmail }) {
  return (
    <HarborForm schema={accountSchema} initial={initial} onSubmit={saveAccount}>
      <AccountSettingsFields saveAccount={saveAccount} checkEmail={checkEmail} />
    </HarborForm>
  );
}

function AccountSettingsFields({ saveAccount, checkEmail }) {
  useFormDirtyGuard();
  const autosave = useFormAutosave({
    delay: 900,
    onlyWhenValid: true,
    save: saveAccount,
  });
  useAsyncFieldValidation({
    path: "email",
    validate: async (email) =>
      (await checkEmail(email)) ? true : "Email is already in use",
  });

  return (
    <>
      <HarborField name="email" label="Email">
        <TextField />
      </HarborField>
      <HarborField name="displayName" label="Display name">
        <TextField />
      </HarborField>
      <DomainFields />
      <Button type="button" onClick={() => void autosave.flush()}>
        Save now
      </Button>
    </>
  );
}

function DomainFields() {
  const domains = useFieldArray<string>("domains");

  return (
    <section>
      {domains.items.map((domain, index) => (
        <HarborField key={index} name={`domains.${index}`} label={`Domain ${index + 1}`}>
          <TextField />
        </HarborField>
      ))}
      <Button type="button" onClick={() => domains.append("")}>
        Add domain
      </Button>
    </section>
  );
}
```

## Server Errors

Use `useServerErrors` after a mutation fails. It accepts either an error map or an array of `{ path, message }` issues.

```tsx
function SubmitErrors({ mutation }) {
  const { setServerErrors, clearServerErrors } = useServerErrors();

  async function submit(values) {
    clearServerErrors();
    const result = await mutation(values);
    if (!result.ok) {
      setServerErrors(result.fieldErrors);
    }
  }
}
```

## Wizard Flows

`useFormWizard` coordinates multi-step forms without splitting form state. Forward navigation can validate only the fields owned by the current step.

```tsx
const wizard = useFormWizard({
  steps: [
    { id: "account", label: "Account", fields: ["email", "displayName"] },
    { id: "domains", label: "Domains", fields: ["domains"] },
  ],
});

<Button type="button" disabled={!wizard.canGoNext} onClick={wizard.next}>
  Next
</Button>;
```

## Adapters

Harbor forms can use Harbor schema directly, Zod-like schemas through `fromZod`, Standard Schema validators through `fromStandardSchema`, or expose a React Hook Form resolver with `toReactHookFormResolver`.

```tsx
const schema = fromZod(z.object({ email: z.string().email() }));
const resolver = toReactHookFormResolver(schema);
```

## Props

- `HarborForm`: `schema`, `initial`, `onSubmit`, optional `onSubmitError`, `mode`, and `reValidateMode`.
- `HarborField`: `name`, `label`, `helper`, layout props, and a single controlled input child.
- `useFormAutosave`: debounced save with `pending`, `isSaving`, `lastSavedAt`, `error`, and `flush`; after a successful save it marks the saved snapshot as clean so dirty guards stop warning.
- `useFormDirtyGuard`: browser-level unsaved-change guard.
- `useAsyncFieldValidation`: field-level async checks for uniqueness and remote policy.
- `useFieldArray`: append, insert, remove, move, and replace helpers.
- `useFormWizard`: current step, progress, step errors, and navigation helpers.

## Gotchas

`HarborForm` is an orchestration layer, not a replacement for every form ecosystem. Use adapters when the app already standardizes on Zod, Standard Schema, or React Hook Form.

Autosave should still persist through your app's mutation/data layer. Harbor tracks dirty state, schedules saves, and clears dirty state for the exact snapshot that was saved. It does not own cache invalidation, optimistic updates, retries, or URL state.

`HarborField` clones one child control and wires `value`, `onChange`, and `onBlur`. For custom composed controls, read and write form state with `useHarborForm`.
