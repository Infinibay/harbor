import { describe, it, expect, vi } from "vitest";
import { screen, act, waitFor } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ToastProvider, useToast } from "./Toast";

/** Helper component that accesses the toast context */
function ToastCaller({
  action,
}: {
  action: (push: ReturnType<typeof useToast>["push"]) => void;
}) {
  const { push } = useToast();
  return <button onClick={() => action(push)}>Fire</button>;
}

describe("Toast", () => {
  it("renders nothing initially", () => {
    const { container } = renderWithHarbor(
      <ToastProvider>
        <span>App</span>
      </ToastProvider>,
    );
    expect(container.textContent).toContain("App");
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it("renders a toast after push()", async () => {
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) => push({ title: "Saved!", duration: 0 })}
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("renders description when provided", async () => {
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) =>
            push({ title: "Done", description: "Item saved", duration: 0 })
          }
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Item saved")).toBeInTheDocument();
  });

  it("renders action button when provided", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) =>
            push({
              title: "Deleted",
              action: { label: "Undo", onClick },
              duration: 0,
            })
          }
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });

  it("fires action.onClick and dismisses toast", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) =>
            push({
              title: "Alert",
              action: { label: "Go", onClick },
              duration: 0,
            })
          }
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    await user.click(screen.getByText("Go"));
    expect(onClick).toHaveBeenCalledTimes(1);
    // Toast is removed from React state — AnimatePresence may keep DOM briefly
    await waitFor(() => {
      expect(screen.queryByText("Alert")).toBeNull();
    });
  });
  it("dismisses toast via × button", async () => {
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) => push({ title: "Bye", duration: 0 })}
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    expect(screen.getByText("Bye")).toBeInTheDocument();
    // Dismiss button is rendered via Portal — find in document
    const dismissBtn = document.querySelector('button[aria-label="Dismiss"]') as HTMLElement;
    expect(dismissBtn).toBeTruthy();
    await user.click(dismissBtn!);
    // Toast is removed from state — AnimatePresence may keep DOM briefly
    await waitFor(() => {
      expect(screen.queryByText("Bye")).toBeNull();
    });
  });

  it("renders multiple toasts", async () => {
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) => {
            push({ title: "First", duration: 0 });
            push({ title: "Second", duration: 0 });
          }}
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("applies tone style classes", async () => {
    const { user, container } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) =>
            push({ title: "OK", tone: "success", duration: 0 })
          }
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    // success tone uses emerald border
    const toast = document.querySelector(".border-emerald-400\\/40");
    expect(toast).toBeTruthy();
  });

  it("throws when useToast is used outside ToastProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderWithHarbor(<ToastCaller action={() => {}} />);
    }).toThrow("useToast must be used inside <ToastProvider>");
    spy.mockRestore();
  });

  it("renders toast via Portal (in document)", async () => {
    const { user } = renderWithHarbor(
      <ToastProvider>
        <ToastCaller
          action={(push) => push({ title: "Portal", duration: 0 })}
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Fire"));
    // Toast is rendered via Portal in a fixed-position container
    expect(document.querySelector(".fixed.bottom-6")).toBeTruthy();
  });
});
