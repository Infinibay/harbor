import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { f, runValidate } from "../schema";
import { Button } from "../../components/buttons/Button";
import { TextField } from "../../components/inputs/TextField";
import { fromStandardSchema, fromZod, toReactHookFormResolver } from "./adapters";
import { HarborField } from "./HarborField";
import { HarborForm } from "./HarborForm";
import {
  useFieldArray,
  useAsyncFieldValidation,
  useFormAutosave,
  useFormDirtyGuard,
  useFormStatus,
  useFormWizard,
  useHarborForm,
  useServerErrors,
} from "./hooks";

const schema = f.object({
  email: f.string().email().required(),
  tags: f.array(f.string()),
});

function FormWithServerErrors() {
  return (
    <HarborForm
      schema={schema}
      initial={{ email: "", tags: [] }}
      onSubmit={() => {}}
    >
      <HarborField name="email" label="Email">
        <TextField />
      </HarborField>
      <ServerErrorControls />
    </HarborForm>
  );
}

function ServerErrorControls() {
  const { setServerErrors, clearServerErrors } = useServerErrors();
  return (
    <div>
      <Button
        type="button"
        onClick={() => setServerErrors([{ path: "email", message: "Already taken" }])}
      >
        Apply server error
      </Button>
      <Button type="button" onClick={clearServerErrors}>
        Clear server errors
      </Button>
    </div>
  );
}

function TagsEditor() {
  const tags = useFieldArray<string>("tags");
  return (
    <div>
      <ul>
        {tags.items.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <Button type="button" onClick={() => tags.append("alpha")}>
        Append
      </Button>
      <Button type="button" onClick={() => tags.insert(0, "first")}>
        Insert first
      </Button>
      <Button type="button" onClick={() => tags.move(1, 0)}>
        Move
      </Button>
      <Button type="button" onClick={() => tags.remove(0)}>
        Remove first
      </Button>
    </div>
  );
}

function DirtyGuardFixture() {
  useFormDirtyGuard();
  return (
    <HarborField name="email" label="Email">
      <TextField />
    </HarborField>
  );
}

function AsyncEmailValidator() {
  useAsyncFieldValidation<string>({
    path: "email",
    delay: 0,
    validate: async (value) =>
      value === "taken@example.com" ? "Email is already taken" : true,
  });
  return (
    <HarborField name="email" label="Email">
      <TextField />
    </HarborField>
  );
}

function AutosaveFixture({
  save,
}: {
  save: (values: { email: string; tags: string[] }) => void | Promise<void>;
}) {
  const autosave = useFormAutosave<{ email: string; tags: string[] }>({
    delay: 0,
    onlyWhenValid: false,
    save,
  });
  const status = useFormStatus();
  return (
    <div>
      <HarborField name="email" label="Email">
        <TextField />
      </HarborField>
      <div data-testid="autosave-pending">{String(autosave.pending)}</div>
      <div data-testid="autosave-saving">{String(autosave.isSaving)}</div>
      <div data-testid="autosave-saved">
        {autosave.lastSavedAt ? "saved" : "idle"}
      </div>
      <div data-testid="autosave-dirty">{String(status.isDirty)}</div>
      <Button type="button" onClick={() => void autosave.flush()}>
        Save now
      </Button>
    </div>
  );
}

function WizardFixture() {
  const wizard = useFormWizard({
    steps: [
      { id: "account", label: "Account", fields: ["email"] },
      { id: "tags", label: "Tags", fields: ["tags"] },
    ],
  });
  return (
    <div>
      <div data-testid="step">{wizard.step.id}</div>
      <div data-testid="progress">{wizard.progress}</div>
      {wizard.step.id === "account" ? (
        <HarborField name="email" label="Email">
          <TextField />
        </HarborField>
      ) : (
        <TagsEditor />
      )}
      <Button type="button" onClick={wizard.previous}>
        Previous
      </Button>
      <Button type="button" onClick={wizard.next}>
        Next
      </Button>
    </div>
  );
}

describe("pragmatic form helpers", () => {
  it("maps server errors into field errors and can clear them", async () => {
    const user = userEvent.setup();
    render(<FormWithServerErrors />);

    await user.click(screen.getByRole("button", { name: "Apply server error" }));
    expect(await screen.findByText("Already taken")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear server errors" }));
    await waitFor(() => expect(screen.queryByText("Already taken")).toBeNull());
  });

  it("manages field arrays through form state", async () => {
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={schema}
        initial={{ email: "", tags: [] }}
        onSubmit={() => {}}
      >
        <TagsEditor />
      </HarborForm>,
    );

    await user.click(screen.getByRole("button", { name: "Append" }));
    expect(screen.getByText("alpha")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Insert first" }));
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "first",
      "alpha",
    ]);

    await user.click(screen.getByRole("button", { name: "Move" }));
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "alpha",
      "first",
    ]);

    await user.click(screen.getByRole("button", { name: "Remove first" }));
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "first",
    ]);
  });

  it("registers a beforeunload dirty guard only after edits", async () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const user = userEvent.setup();

    const { unmount } = render(
      <HarborForm
        schema={schema}
        initial={{ email: "", tags: [] }}
        onSubmit={() => {}}
      >
        <DirtyGuardFixture />
      </HarborForm>,
    );

    expect(add).not.toHaveBeenCalledWith("beforeunload", expect.any(Function));

    await user.type(screen.getByLabelText("Email"), "a");

    await waitFor(() => {
      expect(add).toHaveBeenCalledWith("beforeunload", expect.any(Function));
    });

    unmount();
    expect(remove).toHaveBeenCalledWith("beforeunload", expect.any(Function));

    add.mockRestore();
    remove.mockRestore();
  });

  it("supports async field validation without replacing the schema", async () => {
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={schema}
        initial={{ email: "", tags: [] }}
        onSubmit={() => {}}
      >
        <AsyncEmailValidator />
      </HarborForm>,
    );

    await user.type(screen.getByLabelText("Email"), "taken@example.com");
    expect(await screen.findByText("Email is already taken")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "free@example.com");
    await waitFor(() =>
      expect(screen.queryByText("Email is already taken")).toBeNull(),
    );
  });

  it("autosaves dirty form values without saving the initial payload", async () => {
    const save = vi.fn();
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={schema}
        initial={{ email: "start@example.com", tags: [] }}
        onSubmit={() => {}}
      >
        <AutosaveFixture save={save} />
      </HarborForm>,
    );

    await new Promise((resolve) => window.setTimeout(resolve, 10));
    expect(save).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "next@example.com");

    await waitFor(() =>
      expect(save).toHaveBeenLastCalledWith({
        email: "next@example.com",
        tags: [],
      }),
    );
    expect(screen.getByTestId("autosave-saved")).toHaveTextContent("saved");
    await waitFor(() =>
      expect(screen.getByTestId("autosave-dirty")).toHaveTextContent("false"),
    );
  });

  it("can flush autosave manually for save-now controls", async () => {
    const save = vi.fn();
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={schema}
        initial={{ email: "start@example.com", tags: [] }}
        onSubmit={() => {}}
      >
        <AutosaveFixture save={save} />
      </HarborForm>,
    );

    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "manual@example.com");
    await user.click(screen.getByRole("button", { name: "Save now" }));

    await waitFor(() =>
      expect(save).toHaveBeenLastCalledWith({
        email: "manual@example.com",
        tags: [],
      }),
    );
  });

  it("coordinates wizard steps and blocks forward navigation on invalid fields", async () => {
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={schema}
        initial={{ email: "", tags: [] }}
        onSubmit={() => {}}
      >
        <WizardFixture />
      </HarborForm>,
    );

    expect(screen.getByTestId("step")).toHaveTextContent("account");

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByTestId("step")).toHaveTextContent("account");
    expect(await screen.findByText("This field is required")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "ok@example.com");
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByTestId("step")).toHaveTextContent("tags");
    expect(screen.getByTestId("progress")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByTestId("step")).toHaveTextContent("account");
  });

  it("adapts zod-like safeParse schemas", () => {
    const adapted = fromZod<{ email: string }>({
      safeParse(value) {
        if ((value as { email?: string }).email === "ok@example.com") {
          return { success: true, data: value as { email: string } };
        }
        return {
          success: false,
          error: {
            issues: [{ path: ["email"], code: "custom", message: "Invalid email" }],
          },
        };
      },
    });

    expect(runValidate(adapted, { email: "bad" })).toEqual([
      { path: ["email"], code: "custom", message: "Invalid email" },
    ]);
    expect(runValidate(adapted, { email: "ok@example.com" })).toEqual([]);
  });

  it("adapts Standard Schema-like validators", () => {
    const adapted = fromStandardSchema<{ email: string }>({
      "~standard": {
        validate(value) {
          if ((value as { email?: string }).email === "ok@example.com") {
            return { value: value as { email: string } };
          }
          return {
            issues: [{ path: [{ key: "email" }], message: "Invalid email" }],
          };
        },
      },
    });

    expect(runValidate(adapted, { email: "bad" })).toEqual([
      { path: ["email"], code: "invalid", message: "Invalid email" },
    ]);
    expect(runValidate(adapted, { email: "ok@example.com" })).toEqual([]);
  });

  it("creates a React Hook Form-style resolver without depending on RHF", async () => {
    const resolver = toReactHookFormResolver(schema);

    expect(await resolver({ email: "ok@example.com", tags: [] })).toEqual({
      values: { email: "ok@example.com", tags: [] },
      errors: {},
    });

    expect(await resolver({ email: "bad", tags: [] })).toMatchObject({
      values: {},
      errors: {
        email: {
          message: "Enter a valid email address",
          type: "email",
        },
      },
    });
  });
});
