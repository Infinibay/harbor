import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { LabelLane, useLabelLane } from "./LabelLane";
import { FormField } from "./FormField";
import { TextField } from "./TextField";

function Probe() {
  return <span data-testid="probe">{useLabelLane() ? "in" : "out"}</span>;
}

describe("LabelLane", () => {
  it("renders all child FormFields", () => {
    renderWithHarbor(
      <LabelLane>
        <FormField label="Name"><TextField /></FormField>
        <FormField label="Email address"><TextField /></FormField>
      </LabelLane>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("exposes its context to children", () => {
    renderWithHarbor(
      <LabelLane>
        <Probe />
      </LabelLane>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("in");
  });

  it("returns null context outside a LabelLane", () => {
    renderWithHarbor(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("out");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <LabelLane>
        <FormField label="Name" required><TextField /></FormField>
        <FormField label="Email" helper="required"><TextField /></FormField>
      </LabelLane>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
