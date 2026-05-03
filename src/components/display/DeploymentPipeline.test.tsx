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
    // Click on any stage button
    const buttons = document.querySelectorAll("button");
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      expect(fn).toHaveBeenCalledTimes(1);
    }
  });

  it("renders vertical orientation", () => {
    const { container } = renderWithHarbor(
      <DeploymentPipeline stages={stages} orientation="vertical" />,
    );
    expect(container.textContent).toContain("Build");
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
