import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { DeploymentPipeline, type PipelineStage } from "./DeploymentPipeline";

const stages: PipelineStage[] = [
  { id: "build", name: "Build", status: "success", duration: 45000 },
  { id: "test", name: "Test", status: "success", duration: 30000 },
  { id: "deploy", name: "Deploy", status: "running", startedAt: Date.now() - 5000 },
  { id: "verify", name: "Verify", status: "pending" },
];

describe("DeploymentPipeline", () => {
  it("renders stage names", () => {
    const { container } = renderWithHarbor(<DeploymentPipeline stages={stages} />);
    expect(container.textContent).toContain("Build");
    expect(container.textContent).toContain("Test");
    expect(container.textContent).toContain("Deploy");
    expect(container.textContent).toContain("Verify");
  });

  it("renders status labels", () => {
    const { container } = renderWithHarbor(<DeploymentPipeline stages={stages} />);
    expect(container.textContent).toContain("Success");
    expect(container.textContent).toContain("Running");
    expect(container.textContent).toContain("Pending");
  });

  it("renders duration for completed stages", () => {
    const { container } = renderWithHarbor(<DeploymentPipeline stages={stages} />);
    expect(container.textContent).toContain("45s");
  });

  it("fires onStageClick", async () => {
    const fn = vi.fn();
    const { user } = renderWithHarbor(
      <DeploymentPipeline stages={stages} onStageClick={fn} />,
    );
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
    await user.click(buttons[0]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({ id: "build" }),
    );
  });

  it("renders vertical orientation with row-style stage layout", () => {
    const { container: vert } = renderWithHarbor(
      <DeploymentPipeline stages={stages} orientation="vertical" />,
    );
    // Each stage row has `flex-row` in vertical mode only (see component:
    // `vertical ? "flex-row items-center gap-3" : "items-center shrink-0"`).
    // Horizontal mode never emits `flex-row`, so its absence is the discriminator.
    expect(vert.querySelector(".flex-row")).toBeTruthy();
    expect(vert.querySelector(".overflow-x-auto")).toBeNull();
  });

  it("renders detail text", () => {
    const detail: PipelineStage[] = [
      { id: "a", name: "Stage", status: "success", detail: "Detail text" },
    ];
    const { container } = renderWithHarbor(<DeploymentPipeline stages={detail} />);
    expect(container.textContent).toContain("Detail text");
  });

  it("renders empty stages", () => {
    const { container } = renderWithHarbor(<DeploymentPipeline stages={[]} />);
    expect(container).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <DeploymentPipeline stages={stages} className="my-pipe" />,
    );
    expect(container.querySelector(".my-pipe")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<DeploymentPipeline stages={stages} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
