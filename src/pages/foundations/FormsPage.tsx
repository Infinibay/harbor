import { useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import {
  ActionRow,
  Button,
  Checkbox,
  FieldRow,
  LabelLane,
  Select,
  TextField,
  Textarea,
} from "../../components";
import {
  HarborForm,
  HarborField,
  FormDevtools,
  useFormStatus,
  useFormAutosave,
  useHarborForm,
} from "../../lib/form";
import { f, type Infer } from "../../lib/schema";

/* ------------------------------------------------------------------ */
/* Simple form: email + name with validation                            */
/* ------------------------------------------------------------------ */

const simpleSchema = f.object({
  email: f.string().email().required(),
  name: f.string().min(2).required(),
  company: f.string(),
});
type SimpleValues = Infer<typeof simpleSchema>;

function SimpleFormDemo() {
  const [last, setLast] = useState<SimpleValues | null>(null);
  return (
    <HarborForm
      schema={simpleSchema}
      initial={{ email: "", name: "", company: "" }}
      onSubmit={(v) => setLast(v)}
    >
      <Col>
        <FieldRow template="1fr 1fr">
          <HarborField name="name" label="Full name">
            <TextField placeholder="Ada Lovelace" />
          </HarborField>
          <HarborField name="email" label="Email">
            <TextField placeholder="ada@lovelace.dev" />
          </HarborField>
        </FieldRow>
        <HarborField name="company" label="Company" optional>
          <TextField placeholder="Infinibay" />
        </HarborField>
        <ActionRow>
          <Button variant="ghost" type="reset">Reset</Button>
          <Button type="submit">Save</Button>
        </ActionRow>
        {last ? (
          <pre className="text-[11px] font-mono bg-black/30 rounded-lg p-2 text-emerald-300 mt-2">
            {JSON.stringify(last, null, 2)}
          </pre>
        ) : null}
      </Col>
    </HarborForm>
  );
}

/* ------------------------------------------------------------------ */
/* Cross-field: password + confirm                                      */
/* ------------------------------------------------------------------ */

const pwSchema = f
  .object({
    password: f.string().min(8).required(),
    confirm: f.string().required(),
  })
  .refine((v) =>
    v.password === v.confirm
      ? true
      : { message: "Passwords must match", path: ["confirm"] },
  );

function CrossFieldDemo() {
  return (
    <HarborForm
      schema={pwSchema}
      initial={{ password: "", confirm: "" }}
      onSubmit={() => {}}
      mode="onBlur"
    >
      <Col>
        <LabelLane>
          <HarborField name="password" label="Password">
            <TextField type="password" />
          </HarborField>
          <HarborField name="confirm" label="Confirm">
            <TextField type="password" />
          </HarborField>
        </LabelLane>
        <ActionRow>
          <Button type="submit">Create account</Button>
        </ActionRow>
      </Col>
    </HarborForm>
  );
}

/* ------------------------------------------------------------------ */
/* Async submit with server errors                                      */
/* ------------------------------------------------------------------ */

const asyncSchema = f.object({
  username: f.string().min(3).required(),
});

function AsyncSubmitDemo() {
  const [msg, setMsg] = useState<string | null>(null);

  async function save(v: Infer<typeof asyncSchema>) {
    setMsg(null);
    await new Promise((r) => setTimeout(r, 700));
    if (v.username === "taken") {
      throw { path: "username", message: "That username is already taken" };
    }
    setMsg(`Welcome, ${v.username}!`);
  }

  return (
    <HarborForm
      schema={asyncSchema}
      initial={{ username: "" }}
      onSubmit={(v) =>
        save(v).catch((err) => {
          // Surface the server-side error through the form API.
          if (err?.path && err?.message) {
            setMsg(null);
            // We can't easily reach setError from outside — use a helper.
            // For the demo, show the generic banner instead.
            setMsg(`Error: ${err.message}`);
          }
        })
      }
    >
      <AsyncInner msg={msg} />
    </HarborForm>
  );
}

function AsyncInner({ msg }: { msg: string | null }) {
  const { isSubmitting } = useFormStatus();
  return (
    <Col>
      <HarborField
        name="username"
        label="Username"
        helper='Try "taken" to see an async error'
      >
        <TextField placeholder="ada" />
      </HarborField>
      <ActionRow>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Create"}
        </Button>
      </ActionRow>
      {msg ? (
        <div
          className={`text-xs rounded-md px-3 py-2 ${
            msg.startsWith("Error")
              ? "bg-rose-500/15 text-rose-200 border border-rose-400/30"
              : "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30"
          }`}
        >
          {msg}
        </div>
      ) : null}
    </Col>
  );
}

/* ------------------------------------------------------------------ */
/* Autosave                                                             */
/* ------------------------------------------------------------------ */

const noteSchema = f.object({
  title: f.string().min(2).required(),
  body: f.string(),
});

function AutosaveDemo() {
  const [saves, setSaves] = useState<Infer<typeof noteSchema>[]>([]);
  return (
    <HarborForm
      schema={noteSchema}
      initial={{ title: "Draft", body: "" }}
      onSubmit={() => {}}
      mode="onChange"
    >
      <AutosaveInner onSaved={(v) => setSaves((a) => [...a, v])} />
      <div className="mt-2 text-[11px] font-mono text-white/50">
        {saves.length} save{saves.length === 1 ? "" : "s"} ·{" "}
        {saves.length > 0 ? `last: "${saves[saves.length - 1].title}"` : "—"}
      </div>
    </HarborForm>
  );
}

function AutosaveInner({
  onSaved,
}: {
  onSaved: (v: Infer<typeof noteSchema>) => void;
}) {
  useFormAutosave<Infer<typeof noteSchema>>({
    delay: 500,
    save: (v) => onSaved(v),
  });
  return (
    <Col>
      <HarborField name="title" label="Title">
        <TextField />
      </HarborField>
      <HarborField name="body" label="Body" optional>
        <Textarea rows={3} />
      </HarborField>
    </Col>
  );
}

/* ------------------------------------------------------------------ */
/* Nested + array: profile                                              */
/* ------------------------------------------------------------------ */

const profileSchema = f.object({
  user: f.object({
    email: f.string().email().required(),
    country: f.string().oneOf(["us", "mx", "ar"] as const).required(),
  }),
  acceptsTos: f.boolean().required(),
});

function NestedFormDemo() {
  return (
    <HarborForm
      schema={profileSchema}
      initial={{ user: { email: "", country: "us" }, acceptsTos: false }}
      onSubmit={() => {}}
    >
      <NestedInner />
    </HarborForm>
  );
}

function NestedInner() {
  const { setValue, values } = useHarborForm<Infer<typeof profileSchema>>();
  return (
    <Col>
      <HarborField name="user.email" label="Email">
        <TextField />
      </HarborField>
      <HarborField name="user.country" label="Country">
        <Select
          value={values.user.country}
          onChange={(v) => setValue("user.country", v)}
          options={[
            { value: "us", label: "United States" },
            { value: "mx", label: "Mexico" },
            { value: "ar", label: "Argentina" },
          ]}
        />
      </HarborField>
      <Checkbox
        label="Accept the terms of service"
        checked={values.acceptsTos}
        onChange={(e) => setValue("acceptsTos", e.target.checked)}
      />
      <ActionRow>
        <Button type="submit">Continue</Button>
      </ActionRow>
    </Col>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export function FormsPage() {
  return (
    <Group
      id="forms"
      title="Forms · orchestration"
      desc="Schema builder + HarborForm/HarborField. Zero runtime deps: 27 schema tests + 16 form tests. Validation, cross-field refine, async submit, autosave, nested shapes."
    >
      <Demo
        title="Simple form + submit"
        hint="Try clicking Save with empty fields — validation fires on submit, re-validates on change."
        intensity="soft"
      >
        <SimpleFormDemo />
      </Demo>

      <Demo
        title="Cross-field · password confirm"
        hint="Schema refine() attaches the mismatch error to the confirm field."
        intensity="soft"
      >
        <CrossFieldDemo />
      </Demo>

      <Demo
        title="Async submit"
        hint="Schema passes, then async resolver rejects. isSubmitting drives the button."
        intensity="soft"
      >
        <AsyncSubmitDemo />
      </Demo>

      <Demo
        title="Autosave"
        hint="useFormAutosave fires 500ms after the last edit, only when valid."
        intensity="soft"
      >
        <AutosaveDemo />
      </Demo>

      <Demo
        title="Nested shape + array paths"
        hint="name='user.email' and checkboxes — setValue works on any dot path."
        intensity="soft"
      >
        <NestedFormDemo />
      </Demo>

      <Demo
        title="FormDevtools · dev-only inspector"
        hint="Renders nothing in production (import.meta.env.DEV gate)."
        intensity="soft"
        wide
      >
        <HarborForm
          schema={simpleSchema}
          initial={{ email: "", name: "", company: "" }}
          onSubmit={() => {}}
        >
          <Col>
            <HarborField name="email" label="Email"><TextField /></HarborField>
            <HarborField name="name" label="Name"><TextField /></HarborField>
            <span className="text-xs text-white/50">
              Look bottom-right: the Devtools dock shows live values / errors /
              touched / dirty / submit count.
            </span>
            <FormDevtools defaultCollapsed={false} />
          </Col>
        </HarborForm>
      </Demo>
    </Group>
  );
}
