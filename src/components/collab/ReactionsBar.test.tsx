import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ReactionsBar, type Reaction } from "./ReactionsBar";

const reactions: Reaction[] = [
  { emoji: "👍", count: 3, mine: false },
  { emoji: "❤️", count: 1, mine: true },
];

describe("ReactionsBar", () => {
  it("renders existing reactions with counts", () => {
    renderWithHarbor(<ReactionsBar reactions={reactions} onToggle={vi.fn()} />);
    expect(screen.getByText("👍")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("❤️")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders the Add reaction button", () => {
    renderWithHarbor(<ReactionsBar reactions={[]} onToggle={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Add reaction" }),
    ).toBeInTheDocument();
  });

  it("fires onToggle when a reaction button is clicked", async () => {
    const onToggle = vi.fn();
    const { user } = renderWithHarbor(
      <ReactionsBar reactions={reactions} onToggle={onToggle} />,
    );
    // Reaction buttons don't have accessible names; click the emoji's parent
    const thumbBtn = screen.getByText("👍").closest("button")!;
    await user.click(thumbBtn);
    expect(onToggle).toHaveBeenCalledWith("👍");
  });

  it("opens quick-emoji picker on Add reaction click", async () => {
    const { user } = renderWithHarbor(
      <ReactionsBar reactions={[]} onToggle={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Add reaction" }));
    // Default quick emojis should be visible
    expect(screen.getByText("🎉")).toBeInTheDocument();
    expect(screen.getByText("🚀")).toBeInTheDocument();
  });

  it("fires onToggle with picked emoji and closes picker", async () => {
    const onToggle = vi.fn();
    const { user } = renderWithHarbor(
      <ReactionsBar reactions={[]} onToggle={onToggle} />,
    );
    await user.click(screen.getByRole("button", { name: "Add reaction" }));
    await user.click(screen.getByText("🔥"));
    expect(onToggle).toHaveBeenCalledWith("🔥");
    // Picker should be closed now
    expect(screen.queryByText("🎉")).toBeNull();
  });

  it("closes picker when backdrop is clicked", async () => {
    const { user } = renderWithHarbor(
      <ReactionsBar reactions={[]} onToggle={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Add reaction" }));
    expect(screen.getByText("🎉")).toBeInTheDocument();
    // Click the backdrop overlay
    const backdrop = document.querySelector(".fixed.inset-0");
    expect(backdrop).toBeTruthy();
    await user.click(backdrop!);
    expect(screen.queryByText("🎉")).toBeNull();
  });

  it("uses custom quickEmojis", async () => {
    const customEmojis = ["\ud83c\udf1f", "\ud83d\udca1"];
    const { user } = renderWithHarbor(
      <ReactionsBar
        reactions={[]}
        onToggle={vi.fn()}
        quickEmojis={customEmojis}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Add reaction" }));
    expect(screen.getByText("\ud83c\udf1f")).toBeInTheDocument();
    expect(screen.getByText("\ud83d\udca1")).toBeInTheDocument();
  });

  it("applies 'mine' style when reaction.mine=true", () => {
    renderWithHarbor(<ReactionsBar reactions={reactions} onToggle={vi.fn()} />);
    // The heart button (mine=true) should have fuchsia border
    const heartBtn = screen.getByText("❤️").closest("button")!;
    expect(heartBtn.className).toContain("border-fuchsia-400/40");
  });

  it("applies 'not mine' style when reaction.mine=false", () => {
    renderWithHarbor(<ReactionsBar reactions={reactions} onToggle={vi.fn()} />);
    const thumbBtn = screen.getByText("👍").closest("button")!;
    expect(thumbBtn.className).toContain("border-white/10");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ReactionsBar reactions={[]} onToggle={vi.fn()} className="my-bar" />,
    );
    expect(container.querySelector(".my-bar")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ReactionsBar reactions={reactions} onToggle={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
