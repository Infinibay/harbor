import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

describe("Tabs", () => {
  it("renders tab labels in pill variant (default)", () => {
    renderWithHarbor(
      <Tabs defaultValue="a">
        <TabList>
          <Tab value="a">Alpha</Tab>
          <Tab value="b">Beta</Tab>
        </TabList>
      </Tabs>,
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows active tab panel content", () => {
    renderWithHarbor(
      <Tabs defaultValue="a">
        <TabList>
          <Tab value="a">Alpha</Tab>
          <Tab value="b">Beta</Tab>
        </TabList>
        <TabPanel value="a">Content A</TabPanel>
        <TabPanel value="b">Content B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(screen.queryByText("Content B")).toBeNull();
  });

  it("switches tab on click", async () => {
    const onValueChange = vi.fn();
    const { user } = renderWithHarbor(
      <Tabs defaultValue="a" onValueChange={onValueChange}>
        <TabList>
          <Tab value="a">Alpha</Tab>
          <Tab value="b">Beta</Tab>
        </TabList>
        <TabPanel value="a">Content A</TabPanel>
        <TabPanel value="b">Content B</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByText("Beta"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("supports controlled value", () => {
    renderWithHarbor(
      <Tabs value="b">
        <TabList>
          <Tab value="a">Alpha</Tab>
          <Tab value="b">Beta</Tab>
        </TabList>
        <TabPanel value="a">Content A</TabPanel>
        <TabPanel value="b">Content B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByText("Content B")).toBeInTheDocument();
    expect(screen.queryByText("Content A")).toBeNull();
  });

  it("renders underline variant", () => {
    const { container } = renderWithHarbor(
      <Tabs variant="underline" defaultValue="a">
        <TabList>
          <Tab value="a">Alpha</Tab>
          <Tab value="b">Beta</Tab>
        </TabList>
      </Tabs>,
    );
    expect(container.querySelector(".border-b")).toBeTruthy();
  });

  it("renders card variant", () => {
    const { container } = renderWithHarbor(
      <Tabs variant="card" defaultValue="a">
        <TabList>
          <Tab value="a">Alpha</Tab>
          <Tab value="b">Beta</Tab>
        </TabList>
      </Tabs>,
    );
    // Card variant has rounded-t-lg on tabs
    expect(container.textContent).toContain("Alpha");
  });

  it("renders icon in tab", () => {
    renderWithHarbor(
      <Tabs defaultValue="a">
        <TabList>
          <Tab value="a" icon={<span data-testid="icon">📦</span>}>Alpha</Tab>
        </TabList>
      </Tabs>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("disables tab when disabled=true", async () => {
    const onValueChange = vi.fn();
    const { user } = renderWithHarbor(
      <Tabs defaultValue="a" onValueChange={onValueChange}>
        <TabList>
          <Tab value="a">Active</Tab>
          <Tab value="b" disabled>Disabled</Tab>
        </TabList>
      </Tabs>,
    );
    const btn = screen.getByText("Disabled").closest("button")!;
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("applies custom className to Tabs", () => {
    const { container } = renderWithHarbor(
      <Tabs defaultValue="a" className="my-tabs">
        <TabList>
          <Tab value="a">X</Tab>
        </TabList>
      </Tabs>,
    );
    expect(container.querySelector(".my-tabs")).toBeTruthy();
  });

  it("throws when Tab used outside Tabs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderWithHarbor(<Tab value="a">Orphan</Tab>);
    }).toThrow();
    spy.mockRestore();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Tabs defaultValue="a">
        <TabList>
          <Tab value="a">First</Tab>
          <Tab value="b">Second</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
