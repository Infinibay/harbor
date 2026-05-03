import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { NoteCard } from "./NoteCard";

describe("NoteCard", () => {
  it("renders children text", () => {
    const { container } = renderWithHarbor(<NoteCard>Hello note</NoteCard>);
    expect(container.textContent).toContain("Hello note");
  });

  it("renders title", () => {
    const { container } = renderWithHarbor(<NoteCard title="My Note">Content</NoteCard>);
    expect(container.textContent).toContain("My Note");
  });

  it("renders author", () => {
    const { container } = renderWithHarbor(<NoteCard author="Ana">Content</NoteCard>);
    expect(container.textContent).toContain("Ana");
  });

  it("renders date", () => {
    const { container } = renderWithHarbor(<NoteCard date="Today">Content</NoteCard>);
    expect(container.textContent).toContain("Today");
  });

  it("applies yellow color by default", () => {
    const { container } = renderWithHarbor(<NoteCard>Test</NoteCard>);
    const div = container.querySelector(".rounded-xl");
    expect(div?.className).toContain("bg-[#3a330f]");
  });

  it("applies pink color", () => {
    const { container } = renderWithHarbor(<NoteCard color="pink">Test</NoteCard>);
    const div = container.querySelector(".rounded-xl");
    expect(div?.className).toContain("bg-[#3a1230]");
  });

  it("applies tilt rotation", () => {
    const { container } = renderWithHarbor(<NoteCard tilt={3}>Test</NoteCard>);
    const div = container.querySelector(".rounded-xl");
    expect(div?.getAttribute("style")).toContain("rotate(3deg)");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<NoteCard className="my-note">X</NoteCard>);
    expect(container.querySelector(".my-note")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <NoteCard title="Note" author="Ana" date="now">
        Content
      </NoteCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
