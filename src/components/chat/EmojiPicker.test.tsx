import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { EmojiPicker } from "./EmojiPicker";

describe("EmojiPicker", () => {
  it("renders the search input", () => {
    renderWithHarbor(<EmojiPicker onPick={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("renders category tabs", () => {
    renderWithHarbor(<EmojiPicker onPick={vi.fn()} />);
    expect(screen.getByText("Smileys")).toBeInTheDocument();
    expect(screen.getByText("Gestures")).toBeInTheDocument();
    expect(screen.getByText("Hearts")).toBeInTheDocument();
    expect(screen.getByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
  });

  it("renders emojis for the default category (Smileys)", () => {
    renderWithHarbor(<EmojiPicker onPick={vi.fn()} />);
    expect(screen.getByText("😀")).toBeInTheDocument();
  });

  it("switches category on tab click", async () => {
    const { user } = renderWithHarbor(<EmojiPicker onPick={vi.fn()} />);
    await user.click(screen.getByText("Gestures"));
    expect(screen.getByText("👍")).toBeInTheDocument();
  });

  it("fires onPick when an emoji is clicked", async () => {
    const onPick = vi.fn();
    const { user } = renderWithHarbor(<EmojiPicker onPick={onPick} />);
    await user.click(screen.getByText("😀"));
    expect(onPick).toHaveBeenCalledWith("😀");
  });

  it("filters emojis via search", async () => {
    const onPick = vi.fn();
    const { user } = renderWithHarbor(<EmojiPicker onPick={onPick} />);
    const input = screen.getByPlaceholderText("Search…");
    await user.type(input, "🔥");
    // Category tabs should be hidden when searching
    expect(screen.queryByText("Smileys")).toBeNull();
    // The fire emoji should be visible
    expect(screen.getByText("🔥")).toBeInTheDocument();
  });

  it("hides category tabs when searching", async () => {
    const { user } = renderWithHarbor(<EmojiPicker onPick={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search…");
    await user.type(input, "x");
    // Categories should be hidden
    expect(screen.queryByText("Smileys")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <EmojiPicker onPick={vi.fn()} className="my-picker" />,
    );
    const el = container.querySelector(".my-picker");
    expect(el).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<EmojiPicker onPick={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
