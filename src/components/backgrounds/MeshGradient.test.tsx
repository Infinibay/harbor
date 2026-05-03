import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MeshGradient } from "./MeshGradient";

describe("MeshGradient", () => {
  it("renders without crashing", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom blobs prop", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient blobs={6} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom blobSize prop", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient blobSize={0.5} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom blur prop", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient blur={40} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom drift prop", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient drift={0.15} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom speed prop", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient speed={2} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom intensity prop", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient intensity={0.8} />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders with custom palette prop", () => {
    const { unmount, container } = renderWithHarbor(
      <MeshGradient palette={["#ff8800", "#8800ff"]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("renders when paused", () => {
    const { unmount, container } = renderWithHarbor(<MeshGradient paused />);
    expect(container.firstElementChild).toBeTruthy();
    unmount();
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(<MeshGradient />);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithHarbor(<MeshGradient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
