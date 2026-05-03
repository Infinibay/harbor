import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Terminal } from "./Terminal";

const lines = [
  { id: 1, kind: "cmd" as const, text: "npm run build" },
  { id: 2, kind: "out" as const, text: "Building project..." },
  { id: 3, kind: "err" as const, text: "Error: missing dependency" },
  { id: 4, kind: "info" as const, text: "Done in 2.3s" },
];

describe("Terminal", () => {
  it("renders line text", () => {
    const { container } = renderWithHarbor(<Terminal lines={lines} />);
    expect(container.textContent).toContain("npm run build");
    expect(container.textContent).toContain("Building project...");
    expect(container.textContent).toContain("Error: missing dependency");
  });

  it("renders title in header", () => {
    const { container } = renderWithHarbor(
      <Terminal lines={[]} title="my-shell" />,
    );
    expect(container.textContent).toContain("my-shell");
  });

  it("renders default title 'terminal'", () => {
    const { container } = renderWithHarbor(<Terminal lines={[]} />);
    expect(container.textContent).toContain("terminal");
  });

  it("renders prompt for cmd lines", () => {
    const { container } = renderWithHarbor(<Terminal lines={lines} />);
    // cmd lines show the prompt span (emerald colored)
    const prompt = container.querySelector("span.text-emerald-400");
    expect(prompt).toBeTruthy();
    expect(prompt?.textContent).toContain("$");
  });

  it("renders custom prompt", () => {
    const { container } = renderWithHarbor(
      <Terminal lines={[{ id: 1, kind: "cmd", text: "ls" }]} prompt=">" />,
    );
    const prompt = container.querySelector("span.text-emerald-400");
    expect(prompt?.textContent).toContain(">");
  });

  it("does not render prompt for non-cmd lines", () => {
    const { container } = renderWithHarbor(
      <Terminal lines={[{ id: 1, kind: "out", text: "output" }]} />,
    );
    const prompt = container.querySelector("span.text-emerald-400");
    expect(prompt).toBeNull();
  });

  it("renders with custom height", () => {
    const { container } = renderWithHarbor(
      <Terminal lines={lines} height={400} />,
    );
    const scrollDiv = container.querySelector("[style*='height']");
    expect(scrollDiv?.getAttribute("style")).toContain("400");
  });

  it("renders empty lines array", () => {
    const { container } = renderWithHarbor(<Terminal lines={[]} />);
    expect(container.textContent).toContain("terminal");
  });

  it("renders the blinking cursor", () => {
    const { container } = renderWithHarbor(<Terminal lines={[]} />);
    const cursor = container.querySelector(".animate-pulse");
    expect(cursor).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Terminal lines={[]} className="my-term" />,
    );
    expect(container.querySelector(".my-term")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Terminal lines={lines} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
