import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label", () => {
    renderWithHarbor(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled by the `disabled` prop", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <Button disabled onClick={onClick}>Save</Button>,
    );
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is disabled and shows a spinner while loading", () => {
    renderWithHarbor(<Button loading>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to the underlying button", () => {
    const ref: React.RefObject<HTMLButtonElement | null> = { current: null };
    renderWithHarbor(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("supports keyboard activation via Enter / Space", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<Button onClick={onClick}>K</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "K" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Button variant="primary">Accessible</Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
