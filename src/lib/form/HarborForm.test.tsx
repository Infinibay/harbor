import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { f } from "../schema";
import { HarborForm } from "./HarborForm";
import { HarborField } from "./HarborField";
import { TextField } from "../../components/inputs/TextField";
import { Button } from "../../components/buttons/Button";
import { useHarborForm, useFormStatus } from "./hooks";

const userSchema = f.object({
  email: f.string().email().required(),
  name: f.string().min(2).required(),
});

function Fixture({
  onSubmit,
  mode,
}: {
  onSubmit?: (v: unknown) => void;
  mode?: "onSubmit" | "onBlur" | "onChange";
}) {
  return (
    <HarborForm
      schema={userSchema}
      initial={{ email: "", name: "" }}
      mode={mode}
      onSubmit={(v) => onSubmit?.(v)}
    >
      <HarborField name="email" label="Email">
        <TextField />
      </HarborField>
      <HarborField name="name" label="Name">
        <TextField />
      </HarborField>
      <Button type="submit">Save</Button>
      <StatusBadge />
    </HarborForm>
  );
}

function StatusBadge() {
  const { isSubmitting, isValid } = useFormStatus();
  return (
    <div data-testid="status">
      {isSubmitting ? "submitting" : isValid ? "valid" : "invalid"}
    </div>
  );
}

describe("HarborForm", () => {
  it("renders HarborField-wrapped inputs with their initial values", () => {
    render(<Fixture />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("validates on submit and blocks onValid when invalid", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Fixture onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).not.toHaveBeenCalled();
    // Two required errors surface.
    expect(await screen.findAllByText(/required/i)).toHaveLength(2);
  });

  it("passes valid values to onSubmit", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Fixture onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: "a@b.com",
        name: "Ada",
      }),
    );
  });

  it("clears a field's error as the user fixes it (reValidateMode onChange)", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    const emailErrors = await screen.findAllByText(/required/i);
    expect(emailErrors.length).toBeGreaterThan(0);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await waitFor(
      () => expect(screen.queryByText(/email/i)).not.toBeNull(),
      // Name error still lingers until Name is filled.
    );
    // Email specific error should be gone, but Name still missing.
    await user.type(screen.getByLabelText("Name"), "Ada");
    await waitFor(() =>
      expect(screen.queryByText(/required/i)).toBeNull(),
    );
  });

  it("mode='onChange' validates live on every keystroke", async () => {
    const user = userEvent.setup();
    render(<Fixture mode="onChange" />);
    const email = screen.getByLabelText("Email");
    await user.type(email, "not-an-email");
    await waitFor(() =>
      expect(
        screen.getByText(/Enter a valid email address/i),
      ).toBeInTheDocument(),
    );
  });

  it("exposes form state via useHarborForm", async () => {
    function Inspector() {
      const { values, errors, submitCount } = useHarborForm<{
        email: string;
        name: string;
      }>();
      return (
        <div>
          <span data-testid="email">{values.email}</span>
          <span data-testid="errs">{Object.keys(errors).length}</span>
          <span data-testid="count">{submitCount}</span>
        </div>
      );
    }
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={userSchema}
        initial={{ email: "", name: "" }}
        onSubmit={() => {}}
      >
        <HarborField name="email" label="Email">
          <TextField />
        </HarborField>
        <Inspector />
        <Button type="submit">Go</Button>
      </HarborForm>,
    );
    await user.type(screen.getByLabelText("Email"), "x@y.com");
    await waitFor(() =>
      expect(screen.getByTestId("email").textContent).toBe("x@y.com"),
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    await waitFor(() =>
      expect(Number(screen.getByTestId("count").textContent)).toBe(1),
    );
  });

  it("cross-field refine() attaches to a specific path", async () => {
    const schema = f
      .object({
        password: f.string().min(8).required(),
        confirm: f.string().required(),
      })
      .refine((v) =>
        v.password === v.confirm
          ? true
          : { message: "Does not match", path: ["confirm"] },
      );
    const user = userEvent.setup();
    render(
      <HarborForm
        schema={schema}
        initial={{ password: "", confirm: "" }}
        onSubmit={() => {}}
      >
        <HarborField name="password" label="Password">
          <TextField type="password" />
        </HarborField>
        <HarborField name="confirm" label="Confirm">
          <TextField type="password" />
        </HarborField>
        <Button type="submit">Save</Button>
      </HarborForm>,
    );
    await user.type(screen.getByLabelText("Password"), "abcdefgh");
    await user.type(screen.getByLabelText("Confirm"), "wrong1234");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Does not match")).toBeInTheDocument();
  });

  it("surfaces status to useFormStatus", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    expect(screen.getByTestId("status").textContent).toBe("valid");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(screen.getByTestId("status").textContent).toBe("invalid"),
    );
  });
});
