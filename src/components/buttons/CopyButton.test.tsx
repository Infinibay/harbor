import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {

  it("renders with default label Copy", () => {
    renderWithHarbor(<CopyButton value="hello" />);
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("renders custom children label", () => {
    renderWithHarbor(<CopyButton value="hello">Copy code</CopyButton>);
    expect(screen.getByText("Copy code")).toBeInTheDocument();
  });
  it("writes the value to the clipboard and shows the Copied state", async () => {
    const { user } = renderWithHarbor(<CopyButton value="test-text" />);
    // user-event installs its own clipboard stub on setup, so spy AFTER render.
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
    await user.click(screen.getByRole("button"));
    expect(writeTextSpy).toHaveBeenCalledWith("test-text");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    renderWithHarbor(<CopyButton value="x" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies sm size class", () => {
    const { container } = renderWithHarbor(<CopyButton value="x" size="sm" />);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("h-7");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<CopyButton value="hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
