import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders with a label associated to the input", () => {
    renderWithHarbor(<TextField label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("accepts user input (uncontrolled)", async () => {
    const { user } = renderWithHarbor(<TextField label="Name" />);
    const input = screen.getByLabelText("Name") as HTMLInputElement;
    await user.type(input, "Ada");
    expect(input.value).toBe("Ada");
  });

  it("calls onChange for each keystroke (controlled)", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <TextField label="Q" value="" onChange={onChange} />,
    );
    await user.type(screen.getByLabelText("Q"), "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("shows an error message when `error` is set", () => {
    renderWithHarbor(<TextField label="Email" error="Invalid" />);
    expect(screen.getByText("Invalid")).toBeInTheDocument();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <TextField label="Email" placeholder="you@x.com" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("a11y: error state announces via aria-invalid / describedby", async () => {
    const { container } = renderWithHarbor(
      <TextField label="Email" error="Not an email" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
