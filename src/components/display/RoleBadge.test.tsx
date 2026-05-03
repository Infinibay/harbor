import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { RoleBadge, type Role } from "./RoleBadge";

const roles: Role[] = ["owner", "admin", "editor", "viewer", "guest", "custom"];

describe("RoleBadge", () => {
  it("renders label for each role", () => {
    for (const role of roles) {
      const { container, unmount } = renderWithHarbor(<RoleBadge role={role} />);
      expect(container.textContent).toBeTruthy();
      unmount();
    }
  });

  it("renders default Owner label for owner", () => {
    const { container } = renderWithHarbor(<RoleBadge role="owner" />);
    expect(container.textContent).toContain("Owner");
  });

  it("renders custom label", () => {
    const { container } = renderWithHarbor(<RoleBadge role="admin" label="Super Admin" />);
    expect(container.textContent).toContain("Super Admin");
  });

  it("renders icon when icon=true", () => {
    const { container } = renderWithHarbor(<RoleBadge role="owner" icon />);
    // Owner icon is 👑
    expect(container.textContent).toContain("👑");
  });

  it("does not render icon when icon not set", () => {
    const { container } = renderWithHarbor(<RoleBadge role="owner" />);
    expect(container.textContent).not.toContain("👑");
  });

  it("applies xs size class", () => {
    const { container } = renderWithHarbor(<RoleBadge role="admin" size="xs" />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("text-[9px]");
  });

  it("applies md size by default", () => {
    const { container } = renderWithHarbor(<RoleBadge role="admin" />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("text-xs");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<RoleBadge role="admin" className="my-badge" />);
    expect(container.querySelector(".my-badge")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<RoleBadge role="admin" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
