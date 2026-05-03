import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { StatusPage, type StatusComponent } from "./StatusPage";

const components: StatusComponent[] = [
  { id: "api", name: "API Gateway", status: "online", group: "Core" },
  { id: "db", name: "Database", status: "online", group: "Core" },
  { id: "cdn", name: "CDN", status: "degraded" },
];

describe("StatusPage", () => {
  it("renders system status banner for operational", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={components}
      />,
    );
    expect(container.textContent).toContain("All systems operational");
  });

  it("renders custom system message", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational", message: "All green!" }}
        components={components}
      />,
    );
    expect(container.textContent).toContain("All green!");
  });

  it("renders degraded status", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "degraded" }}
        components={components}
      />,
    );
    expect(container.textContent).toContain("Degraded performance");
  });

  it("renders major outage status", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "major-outage" }}
        components={components}
      />,
    );
    expect(container.textContent).toContain("Major outage");
  });

  it("renders component names", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={components}
      />,
    );
    expect(container.textContent).toContain("API Gateway");
    expect(container.textContent).toContain("Database");
    expect(container.textContent).toContain("CDN");
  });

  it("renders group headers", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={components}
      />,
    );
    expect(container.textContent).toContain("Core");
  });

  it("renders header slot", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={[]}
        header={<h1>System Status</h1>}
      />,
    );
    expect(container.textContent).toContain("System Status");
  });

  it("renders empty components", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={[]}
      />,
    );
    expect(container.textContent).toContain("All systems operational");
  });

  it("renders component descriptions", () => {
    const withDesc: StatusComponent[] = [
      { id: "api", name: "API", status: "online", description: "REST endpoints" },
    ];
    const { container } = renderWithHarbor(
      <StatusPage system={{ status: "operational" }} components={withDesc} />,
    );
    expect(container.textContent).toContain("REST endpoints");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={[]}
        className="my-status"
      />,
    );
    expect(container.querySelector(".my-status")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <StatusPage
        system={{ status: "operational" }}
        components={components}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
