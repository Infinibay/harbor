import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders a checkbox input with a label", () => {
    renderWithHarbor(<Switch label="Email alerts" />);
    expect(screen.getByLabelText("Email alerts")).toBeInTheDocument();
  });

  it("uncontrolled: defaultChecked drives the initial state AND toggles on click", async () => {
    const { user } = renderWithHarbor(<Switch label="Email alerts" />);
    const input = screen.getByLabelText("Email alerts") as HTMLInputElement;
    expect(input.checked).toBe(false);
    await user.click(input);
    expect(input.checked).toBe(true);
    await user.click(input);
    expect(input.checked).toBe(false);
  });

  it("uncontrolled with defaultChecked=true starts on", () => {
    renderWithHarbor(<Switch label="Email alerts" defaultChecked />);
    const input = screen.getByLabelText("Email alerts") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("controlled: parent drives, clicking fires onChange but DOM reflects prop", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <Switch label="Email alerts" checked={false} onChange={onChange} />,
    );
    const input = screen.getByLabelText("Email alerts") as HTMLInputElement;
    expect(input.checked).toBe(false);
    await user.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    // Without parent re-render (prop stays `checked={false}`), the input
    // stays unchecked — that's the controlled contract.
    expect(input.checked).toBe(false);
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Switch label="Email alerts" description="All critical incidents." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
