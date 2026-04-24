import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FormField } from "./FormField";
import { TextField } from "./TextField";

describe("FormField", () => {
  it("renders its label and wires it to the child input", () => {
    renderWithHarbor(
      <FormField label="Email">
        <TextField />
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  it("marks the label as required with a visible `*`", () => {
    renderWithHarbor(
      <FormField label="Password" required>
        <TextField type="password" />
      </FormField>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows the `(optional)` hint", () => {
    renderWithHarbor(
      <FormField label="Phone" optional>
        <TextField />
      </FormField>,
    );
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });

  it("renders an error message when `error` is set", () => {
    renderWithHarbor(
      <FormField label="Email" error="Invalid address">
        <TextField />
      </FormField>,
    );
    expect(screen.getByText("Invalid address")).toBeInTheDocument();
  });

  it("renders a helper when there's no error", () => {
    renderWithHarbor(
      <FormField label="Email" helper="We won't share it">
        <TextField />
      </FormField>,
    );
    expect(screen.getByText(/won't share/)).toBeInTheDocument();
  });

  it("prefers error over helper when both are set", () => {
    renderWithHarbor(
      <FormField label="Email" helper="Helper text" error="Oops">
        <TextField />
      </FormField>,
    );
    expect(screen.getByText("Oops")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FormField label="Email" helper="We won't share" required>
        <TextField />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
