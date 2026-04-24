import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Select, type SelectOption } from "./Select";

const options: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "mx", label: "Mexico" },
  { value: "ar", label: "Argentina" },
];

describe("Select", () => {
  it("shows the placeholder when no value is selected", () => {
    renderWithHarbor(<Select options={options} placeholder="Choose country" />);
    expect(screen.getByRole("button", { name: /choose country/i })).toBeInTheDocument();
  });

  it("shows the selected option's label", () => {
    renderWithHarbor(<Select options={options} value="mx" />);
    expect(screen.getByRole("button", { name: /mexico/i })).toBeInTheDocument();
  });

  it("opens on click and lets the user pick an option", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <Select options={options} onChange={onChange} />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Argentina"));
    expect(onChange).toHaveBeenCalledWith("ar");
  });

  it("is not interactive when disabled", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <Select options={options} disabled onChange={onChange} />,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("a11y: no violations when closed", async () => {
    const { container } = renderWithHarbor(
      <Select options={options} value="us" label="Region" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
