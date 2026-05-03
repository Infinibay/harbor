import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ErrorState } from "./ErrorState";
import { BootSequence, type BootStage } from "./BootSequence";

const stages: BootStage[] = [
  { id: "bios", label: "BIOS", status: "done", duration: 1200 },
  { id: "kernel", label: "Kernel", status: "done", duration: 3400 },
  { id: "init", label: "Init", status: "running" },
  { id: "services", label: "Services", status: "pending" },
];

describe("BootSequence", () => {
  it("renders stage labels", () => {
    const { container } = renderWithHarbor(<BootSequence stages={stages} />);
    expect(container.textContent).toContain("BIOS");
    expect(container.textContent).toContain("Kernel");
    expect(container.textContent).toContain("Init");
    expect(container.textContent).toContain("Services");
  });

  it("renders status labels", () => {
    const { container } = renderWithHarbor(<BootSequence stages={stages} />);
    expect(container.textContent).toContain("done");
    expect(container.textContent).toContain("running");
    expect(container.textContent).toContain("pending");
  });

  it("renders duration for completed stages", () => {
    const { container } = renderWithHarbor(<BootSequence stages={stages} />);
    // formatDuration(1200, {includeMs:true}) outputs "1s 200ms" or "1.2s"
    expect(container.textContent).toContain("1");
    expect(container.textContent).toContain("3");
  });

  it("renders detail text", () => {
    const detailed: BootStage[] = [
      { id: "x", label: "Test", status: "done", detail: "Extra info" },
    ];
    const { container } = renderWithHarbor(<BootSequence stages={detailed} />);
    expect(container.textContent).toContain("Extra info");
  });

  it("renders empty stages", () => {
    const { container } = renderWithHarbor(<BootSequence stages={[]} />);
    expect(container.querySelector("ol")).toBeTruthy();
  });

  it("renders a single stage", () => {
    const { container } = renderWithHarbor(
      <BootSequence stages={[{ id: "a", label: "Only", status: "failed" }]} />,
    );
    expect(container.textContent).toContain("Only");
    expect(container.textContent).toContain("failed");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <BootSequence stages={stages} className="my-boot" />,
    );
    expect(container.querySelector(".my-boot")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<BootSequence stages={stages} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
