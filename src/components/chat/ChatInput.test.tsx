import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ChatInput } from "./ChatInput";

describe("ChatInput", () => {
  it("renders a textarea with placeholder", () => {
    renderWithHarbor(<ChatInput />);
    expect(screen.getByPlaceholderText("Type a message…")).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    renderWithHarbor(<ChatInput placeholder="Say something" />);
    expect(screen.getByPlaceholderText("Say something")).toBeInTheDocument();
  });

  it("does not show send button when input is empty", () => {
    renderWithHarbor(<ChatInput />);
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
  });

  it("shows send button after typing text", async () => {
    const { user } = renderWithHarbor(<ChatInput />);
    const textarea = screen.getByPlaceholderText("Type a message…");
    await user.type(textarea, "Hello");
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("fires onSend with trimmed text when send button is clicked", async () => {
    const onSend = vi.fn();
    const { user } = renderWithHarbor(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Type a message…");
    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("clears input after sending", async () => {
    const { user } = renderWithHarbor(<ChatInput onSend={vi.fn()} />);
    const textarea = screen.getByPlaceholderText("Type a message…");
    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(textarea).toHaveValue("");
  });

  it("fires onSend on Enter key (without Shift)", async () => {
    const onSend = vi.fn();
    const { user } = renderWithHarbor(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Type a message…");
    await user.type(textarea, "Test{Enter}");
    expect(onSend).toHaveBeenCalledWith("Test");
  });

  it("does not send on Shift+Enter", async () => {
    const onSend = vi.fn();
    const { user } = renderWithHarbor(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Type a message…");
    await user.type(textarea, "Test");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    // Text should still be there (no send)
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send empty text", async () => {
    const onSend = vi.fn();
    const { user } = renderWithHarbor(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Type a message…");
    await user.type(textarea, "   ");
    // Only whitespace — the send button shouldn't appear
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
  });

  it("renders actions slot", () => {
    renderWithHarbor(
      <ChatInput actions={<span data-testid="action">📎</span>} />,
    );
    expect(screen.getByTestId("action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<ChatInput className="my-input" />);
    const el = container.querySelector(".my-input");
    expect(el).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ChatInput />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
