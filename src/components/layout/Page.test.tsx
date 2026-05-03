import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Page } from "./Page";

describe("Page", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <Page>
        <h1>Title</h1>
        <p>Content</p>
      </Page>,
    );
    expect(container.textContent).toContain("Title");
    expect(container.textContent).toContain("Content");
  });

  it("wraps in Container with default size xl", () => {
    const { container } = renderWithHarbor(<Page>X</Page>);
    const wrapper = container.querySelector(".mx-auto");
    expect(wrapper).toBeTruthy();
  });

  it("applies py-6 md:py-8 padding", () => {
    const { container } = renderWithHarbor(<Page>X</Page>);
    const wrapper = container.querySelector(".py-6");
    expect(wrapper).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Page className="my-page">X</Page>,
    );
    expect(container.querySelector(".my-page")).toBeTruthy();
  });

  it("renders with custom gap", () => {
    const { container } = renderWithHarbor(<Page gap="xl">X</Page>);
    expect(container.textContent).toContain("X");
  });

  it("renders with padded=false", () => {
    const { container } = renderWithHarbor(<Page padded={false}>X</Page>);
    // Should still render content
    expect(container.textContent).toContain("X");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Page>
        <section>Section A</section>
        <section>Section B</section>
      </Page>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
