import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FindBar } from "./FindBar";

describe("FindBar", () => {
  it("renders Find input when open", () => {
    renderWithHarbor(<FindBar open={true} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText("Find")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    const { container } = renderWithHarbor(
      <FindBar open={false} onClose={vi.fn()} />,
    );
    expect(screen.queryByPlaceholderText("Find")).toBeNull();
  });

  it("shows match counter when total > 0", () => {
    const { container } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} total={5} current={3} />,
    );
    expect(container.textContent).toContain("3/5");
  });

  it("shows 0/0 when query is set but total is 0", async () => {
    const { container, user } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} />,
    );
    await user.type(screen.getByPlaceholderText("Find"), "x");
    expect(container.textContent).toContain("0/0");
  });

  it("shows Match case toggle (Aa)", () => {
    const { container } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByTitle("Match case")).toBeTruthy();
  });

  it("shows Use regex toggle (.*)", () => {
    const { container } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByTitle("Use regex")).toBeTruthy();
  });

  it("shows previous/next buttons", () => {
    renderWithHarbor(<FindBar open={true} onClose={vi.fn()} />);
    expect(screen.getByTitle("Previous match (⇧⏎)")).toBeTruthy();
    expect(screen.getByTitle("Next match (⏎)")).toBeTruthy();
  });

  it("shows close button", () => {
    renderWithHarbor(<FindBar open={true} onClose={vi.fn()} />);
    expect(screen.getByTitle("Close (Esc)")).toBeTruthy();
  });

  it("fires onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <FindBar open={true} onClose={onClose} />,
    );
    await user.click(screen.getByTitle("Close (Esc)"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onNext when next button is clicked", async () => {
    const onNext = vi.fn();
    const { user } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} onNext={onNext} />,
    );
    await user.click(screen.getByTitle("Next match (⏎)"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("fires onPrev when previous button is clicked", async () => {
    const onPrev = vi.fn();
    const { user } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} onPrev={onPrev} />,
    );
    await user.click(screen.getByTitle("Previous match (⇧⏎)"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("fires onChange when typing in Find input", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} onChange={onChange} />,
    );
    await user.type(screen.getByPlaceholderText("Find"), "hello");
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("shows replace row when onReplace provided and toggle clicked", async () => {
    const onReplace = vi.fn();
    const { user } = renderWithHarbor(
      <FindBar
        open={true}
        onClose={vi.fn()}
        onReplace={onReplace}
      />,
    );
    // Click the replace toggle button
    await user.click(screen.getByTitle("Replace"));
    expect(screen.getByPlaceholderText("Replace")).toBeInTheDocument();
  });

  it("fires onReplace when All button is clicked in replace row", async () => {
    const onReplace = vi.fn();
    const { user } = renderWithHarbor(
      <FindBar
        open={true}
        onClose={vi.fn()}
        onReplace={onReplace}
      />,
    );
    await user.click(screen.getByTitle("Replace"));
    const findInput = screen.getByPlaceholderText("Find");
    await user.type(findInput, "foo");
    const replaceInput = screen.getByPlaceholderText("Replace");
    await user.type(replaceInput, "bar");
    // Use "All" button which is unique, unlike "Replace" which appears in both placeholder and button
    await user.click(screen.getByText("All"));
    expect(onReplace).toHaveBeenCalledWith("foo", "bar");
  });

  it("does not show Replace toggle when onReplace is not provided", () => {
    renderWithHarbor(<FindBar open={true} onClose={vi.fn()} />);
    expect(screen.queryByTitle("Replace")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} className="my-find" />,
    );
    expect(container.querySelector(".my-find")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FindBar open={true} onClose={vi.fn()} total={3} current={1} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
