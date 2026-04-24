import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FieldRow, useFieldRow } from "./FieldRow";
import { FormField } from "./FormField";
import { TextField } from "./TextField";

/** Reads the FieldRow context so we can assert children see it. */
function ProbeInContext() {
  const ctx = useFieldRow();
  return <span data-testid="probe">{ctx ? "in-row" : "out"}</span>;
}

describe("FieldRow", () => {
  it("renders all its field children", () => {
    renderWithHarbor(
      <FieldRow>
        <FormField label="First"><TextField /></FormField>
        <FormField label="Last"><TextField /></FormField>
      </FieldRow>,
    );
    expect(screen.getByLabelText("First")).toBeInTheDocument();
    expect(screen.getByLabelText("Last")).toBeInTheDocument();
  });

  it("exposes a context so children can detect the row", () => {
    renderWithHarbor(
      <FieldRow>
        <ProbeInContext />
      </FieldRow>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("in-row");
  });

  it("returns null context outside a FieldRow", () => {
    renderWithHarbor(<ProbeInContext />);
    expect(screen.getByTestId("probe")).toHaveTextContent("out");
  });

  it("FieldRow.Action renders its button", () => {
    renderWithHarbor(
      <FieldRow>
        <FormField label="Q"><TextField /></FormField>
        <FieldRow.Action>
          <button type="button">Search</button>
        </FieldRow.Action>
      </FieldRow>,
    );
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("a11y: no violations with mixed fields + action", async () => {
    const { container } = renderWithHarbor(
      <FieldRow template="1fr 1fr auto">
        <FormField label="First"><TextField /></FormField>
        <FormField label="Last" error="Required"><TextField /></FormField>
        <FieldRow.Action>
          <button type="button">Search</button>
        </FieldRow.Action>
      </FieldRow>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
