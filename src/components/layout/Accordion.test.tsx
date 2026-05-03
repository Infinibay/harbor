import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Accordion, AccordionItem } from "./Accordion";

describe("Accordion", () => {
  it("renders accordion items with titles", () => {
    renderWithHarbor(
      <Accordion>
        <AccordionItem value="a" title="Section A">
          Content A
        </AccordionItem>
        <AccordionItem value="b" title="Section B">
          Content B
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Section A")).toBeInTheDocument();
    expect(screen.getByText("Section B")).toBeInTheDocument();
  });

  it("does not show content when collapsed (no default)", () => {
    renderWithHarbor(
      <Accordion>
        <AccordionItem value="a" title="Section A">
          Hidden content
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.queryByText("Hidden content")).toBeNull();
  });

  it("opens item with defaultValue", () => {
    renderWithHarbor(
      <Accordion defaultValue="a">
        <AccordionItem value="a" title="Section A">
          Visible content
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("opens item on click", async () => {
    const { user } = renderWithHarbor(
      <Accordion>
        <AccordionItem value="a" title="Section A">
          Expand content
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByText("Section A"));
    expect(screen.getByText("Expand content")).toBeInTheDocument();
  });

  it("toggles item closed on second click", async () => {
    const { user } = renderWithHarbor(
      <Accordion defaultValue="a">
        <AccordionItem value="a" title="Section A">
          Toggle content
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Toggle content")).toBeInTheDocument();
    await user.click(screen.getByText("Section A"));
    // AnimatePresence keeps the panel briefly; wait for the exit to finish.
    await waitFor(() =>
      expect(screen.queryByText("Toggle content")).toBeNull(),
    );
  });

  it("allows multiple open with multiple=true", async () => {
    renderWithHarbor(
      <Accordion multiple defaultValue={["a", "b"]}>
        <AccordionItem value="a" title="A">
          Content A
        </AccordionItem>
        <AccordionItem value="b" title="B">
          Content B
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    renderWithHarbor(
      <Accordion>
        <AccordionItem value="a" title="With Icon" icon={<span>📁</span>}>
          Content
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("📁")).toBeInTheDocument();
  });

  it("renders chevron SVG", () => {
    const { container } = renderWithHarbor(
      <Accordion>
        <AccordionItem value="a" title="Chevron">
          X
        </AccordionItem>
      </Accordion>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("applies custom className to Accordion", () => {
    const { container } = renderWithHarbor(
      <Accordion className="my-accordion">
        <AccordionItem value="a" title="A">
          X
        </AccordionItem>
      </Accordion>,
    );
    expect(container.querySelector(".my-accordion")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Accordion defaultValue="a">
        <AccordionItem value="a" title="Accessible">
          Content
        </AccordionItem>
      </Accordion>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
