import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders page buttons for small total", () => {
    const { container } = renderWithHarbor(
      <Pagination page={1} total={5} onChange={vi.fn()} />,
    );
    // Pages 1-5 + prev/next = 7 buttons
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(7); // ‹ 1 2 3 4 5 ›
  });

  it("renders active page with bg-white class", () => {
    const { container } = renderWithHarbor(
      <Pagination page={3} total={5} onChange={vi.fn()} />,
    );
    const activeBtn = container.querySelector("button.bg-white");
    expect(activeBtn).toBeTruthy();
    expect(activeBtn?.textContent).toBe("3");
  });

  it("disables prev button on page 1", () => {
    const { container } = renderWithHarbor(
      <Pagination page={1} total={5} onChange={vi.fn()} />,
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons[0]).toBeDisabled(); // ‹
  });

  it("disables next button on last page", () => {
    const { container } = renderWithHarbor(
      <Pagination page={5} total={5} onChange={vi.fn()} />,
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons[buttons.length - 1]).toBeDisabled(); // ›
  });

  it("fires onChange with previous page", async () => {
    const onChange = vi.fn();
    const { user, container } = renderWithHarbor(
      <Pagination page={3} total={5} onChange={onChange} />,
    );
    const buttons = container.querySelectorAll("button");
    await user.click(buttons[0]); // ‹
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("fires onChange with next page", async () => {
    const onChange = vi.fn();
    const { user, container } = renderWithHarbor(
      <Pagination page={3} total={5} onChange={onChange} />,
    );
    const buttons = container.querySelectorAll("button");
    await user.click(buttons[buttons.length - 1]); // ›
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("fires onChange when clicking a page number", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <Pagination page={1} total={5} onChange={onChange} />,
    );
    await user.click(screen.getByText("3"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("renders ellipsis for large total", () => {
    const { container } = renderWithHarbor(
      <Pagination page={5} total={20} onChange={vi.fn()} />,
    );
    expect(container.textContent).toContain("…");
  });

  it("always renders first and last page", () => {
    const { container } = renderWithHarbor(
      <Pagination page={5} total={20} onChange={vi.fn()} />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders single page", () => {
    const { container } = renderWithHarbor(
      <Pagination page={1} total={1} onChange={vi.fn()} />,
    );
    const buttons = container.querySelectorAll("button");
    // ‹ + 1 + › = 3 buttons
    expect(buttons.length).toBe(3);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Pagination page={1} total={5} onChange={vi.fn()} className="my-pag" />,
    );
    expect(container.querySelector(".my-pag")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Pagination page={3} total={5} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
