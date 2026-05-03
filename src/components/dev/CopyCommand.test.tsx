import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CopyCommand } from "./CopyCommand";

describe("CopyCommand", () => {
  let writeTextSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextSpy = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: { writeText: writeTextSpy },
    });
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders code with prompt by default", () => {
    const { container } = renderWithHarbor(
      <CopyCommand variants={[{ label: "bash", code: "npm install" }]} />,
    );
    expect(container.textContent).toContain("npm install");
    expect(container.textContent).toContain("$");
  });

  it("hides prompt when showPrompt=false", () => {
    const { container } = renderWithHarbor(
      <CopyCommand
        variants={[{ label: "bash", code: "npm install" }]}
        showPrompt={false}
      />,
    );
    // No $ prompt spans
    const prompt = container.querySelector("span.text-white\\/30");
    expect(prompt).toBeNull();
  });

  it("renders variant tabs for multiple variants", () => {
    renderWithHarbor(
      <CopyCommand
        variants={[
          { label: "macOS", code: "brew install" },
          { label: "Linux", code: "apt install" },
        ]}
      />,
    );
    expect(screen.getByText("macOS")).toBeInTheDocument();
    expect(screen.getByText("Linux")).toBeInTheDocument();
  });

  it("does not render tabs for single variant", () => {
    renderWithHarbor(
      <CopyCommand variants={[{ label: "bash", code: "echo hi" }]} />,
    );
    expect(screen.queryByText("bash")).toBeNull();
  });

  it("switches active variant on tab click", async () => {
    const { user } = renderWithHarbor(
      <CopyCommand
        variants={[
          { label: "macOS", code: "brew install" },
          { label: "Linux", code: "apt install" },
        ]}
      />,
    );
    await user.click(screen.getByText("Linux"));
    // Active tab should show the Linux code
    expect(screen.getByText("apt install")).toBeInTheDocument();
  });

  it("renders Copy button", () => {
    renderWithHarbor(
      <CopyCommand variants={[{ label: "bash", code: "echo hi" }]} />,
    );
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("returns null for empty variants array", () => {
    const { container } = renderWithHarbor(
      <CopyCommand variants={[]} />,
    );
    // Only the HarborProvider style tag
    expect(container.querySelector("div.rounded-xl")).toBeNull();
  });

  it("renders multiline code", () => {
    const { container } = renderWithHarbor(
      <CopyCommand
        variants={[{ label: "sh", code: "line1\nline2\nline3" }]}
      />,
    );
    expect(container.textContent).toContain("line1");
    expect(container.textContent).toContain("line2");
    expect(container.textContent).toContain("line3");
  });

  it("does not show $ prompt for comment lines", () => {
    const { container } = renderWithHarbor(
      <CopyCommand
        variants={[{ label: "sh", code: "# comment\necho hi" }]}
      />,
    );
    // The first line starts with #, so no $ for that line
    const prompts = container.querySelectorAll("span.text-white\\/30");
    // Only "echo hi" line should have a prompt
    expect(prompts.length).toBe(1);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <CopyCommand
        variants={[{ label: "sh", code: "x" }]}
        className="my-cmd"
      />,
    );
    expect(container.querySelector(".my-cmd")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <CopyCommand
        variants={[
          { label: "macOS", code: "brew install" },
          { label: "Linux", code: "apt install" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
