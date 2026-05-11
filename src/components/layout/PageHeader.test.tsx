import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders title and description", () => {
    renderWithHarbor(
      <PageHeader title="Overview" description="Production health" />,
    );
    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("Production health")).toBeInTheDocument();
  });

  it("renders actions and meta", () => {
    renderWithHarbor(
      <PageHeader
        title="Users"
        actions={<button>Invite</button>}
        meta={<span>3 active filters</span>}
      />,
    );
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
    expect(screen.getByText("3 active filters")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <PageHeader title="Settings" className="my-header" />,
    );
    expect(container.querySelector(".my-header")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <PageHeader title="Overview" actions={<button>Refresh</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
