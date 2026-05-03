import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SettingsPanel } from "./SettingsPanel";

const sections = [
  {
    id: "general",
    label: "General",
    items: [
      { id: "profile", label: "Profile", icon: <span>👤</span>, description: "Edit profile" },
      { id: "security", label: "Security" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    items: [
      { id: "api", label: "API Keys" },
    ],
  },
];

describe("SettingsPanel", () => {
  it("renders item labels", () => {
    renderWithHarbor(<SettingsPanel sections={sections} />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("API Keys")).toBeInTheDocument();
  });

  it("renders section labels", () => {
    renderWithHarbor(<SettingsPanel sections={sections} />);
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("renders item descriptions", () => {
    renderWithHarbor(<SettingsPanel sections={sections} />);
    expect(screen.getByText("Edit profile")).toBeInTheDocument();
  });

  it("renders icons", () => {
    renderWithHarbor(<SettingsPanel sections={sections} />);
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("fires onChange on item click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <SettingsPanel sections={sections} onChange={onChange} />,
    );
    await user.click(screen.getByText("Profile"));
    expect(onChange).toHaveBeenCalledWith("profile");
  });

  it("applies active class for selected item", () => {
    const { container } = renderWithHarbor(
      <SettingsPanel sections={sections} value="security" />,
    );
    const activeBtn = container.querySelector(".bg-fuchsia-500\\/15");
    expect(activeBtn).toBeTruthy();
  });

  it("renders header slot", () => {
    renderWithHarbor(
      <SettingsPanel
        sections={sections}
        header={<span data-testid="hdr">Settings</span>}
      />,
    );
    expect(screen.getByTestId("hdr")).toBeInTheDocument();
  });

  it("renders as aside element", () => {
    const { container } = renderWithHarbor(
      <SettingsPanel sections={sections} />,
    );
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <SettingsPanel sections={sections} className="my-panel" />,
    );
    expect(container.querySelector(".my-panel")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <SettingsPanel sections={sections} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
