import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FieldSpacer } from "./FieldSpacer";
import { FieldRow } from "./FieldRow";
import { FormField } from "./FormField";
import { TextField } from "./TextField";

describe("FieldSpacer", () => {
  it("renders an aria-hidden placeholder", () => {
    renderWithHarbor(
      <div data-testid="host">
        <FieldSpacer />
      </div>,
    );
    const host = screen.getByTestId("host");
    const spacer = host.firstElementChild as HTMLElement;
    expect(spacer).toHaveAttribute("aria-hidden");
  });

  it("uses the `match=input` control height by default (44px)", () => {
    renderWithHarbor(
      <div data-testid="host">
        <FieldSpacer />
      </div>,
    );
    const host = screen.getByTestId("host");
    const inner = host.querySelector("[style*='height']") as HTMLElement;
    expect(inner).not.toBeNull();
    expect(inner.style.height).toBe("44px");
  });

  it("respects the `height` override", () => {
    renderWithHarbor(
      <div data-testid="host">
        <FieldSpacer height={72} />
      </div>,
    );
    const host = screen.getByTestId("host");
    const inner = host.querySelector("[style*='height']") as HTMLElement;
    expect(inner.style.height).toBe("72px");
  });

  it("works inside a FieldRow (subgrid variant)", () => {
    renderWithHarbor(
      <FieldRow template="1fr 1fr 1fr">
        <FormField label="A"><TextField /></FormField>
        <FieldSpacer />
        <FormField label="C"><TextField /></FormField>
      </FieldRow>,
    );
    expect(screen.getByLabelText("A")).toBeInTheDocument();
    expect(screen.getByLabelText("C")).toBeInTheDocument();
  });

  it("a11y: no violations (decorative only)", async () => {
    const { container } = renderWithHarbor(<FieldSpacer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
