import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SignaturePad } from "./SignaturePad";

describe("SignaturePad", () => {
  it("renders a canvas element", () => {
    const { container } = renderWithHarbor(<SignaturePad />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("renders Sign here placeholder when empty", () => {
    renderWithHarbor(<SignaturePad />);
    expect(screen.getByText("Sign here")).toBeInTheDocument();
  });

  it("renders Pointer to sign label", () => {
    renderWithHarbor(<SignaturePad />);
    expect(screen.getByText("Pointer to sign")).toBeInTheDocument();
  });

  it("renders Clear button", () => {
    renderWithHarbor(<SignaturePad />);
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("renders canvas with default width and height", () => {
    const { container } = renderWithHarbor(<SignaturePad />);
    const canvas = container.querySelector("canvas");
    expect(canvas?.getAttribute("style")).toContain("480");
    expect(canvas?.getAttribute("style")).toContain("180");
  });

  it("renders canvas with custom width and height", () => {
    const { container } = renderWithHarbor(
      <SignaturePad width={600} height={200} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas?.getAttribute("style")).toContain("600");
    expect(canvas?.getAttribute("style")).toContain("200");
  });

  it("renders cursor-crosshair on canvas", () => {
    const { container } = renderWithHarbor(<SignaturePad />);
    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("cursor-crosshair");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <SignaturePad className="my-sig" />,
    );
    expect(container.querySelector(".my-sig")).toBeTruthy();
  });

  it("wraps in rounded-xl container", () => {
    const { container } = renderWithHarbor(<SignaturePad />);
    expect(container.querySelector(".rounded-xl")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<SignaturePad />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
