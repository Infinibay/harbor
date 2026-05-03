import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { NavBar, type NavItem } from "./NavBar";

const items: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About", icon: <span>ℹ</span> },
  { id: "contact", label: "Contact", href: "/contact" },
];

describe("NavBar", () => {
  it("renders item labels", () => {
    renderWithHarbor(<NavBar items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders brand slot", () => {
    renderWithHarbor(<NavBar items={items} brand={<span>MyApp</span>} />);
    expect(screen.getByText("MyApp")).toBeInTheDocument();
  });

  it("renders right slot", () => {
    renderWithHarbor(<NavBar items={items} right={<span>Avatar</span>} />);
    expect(screen.getByText("Avatar")).toBeInTheDocument();
  });

  it("renders icons", () => {
    renderWithHarbor(<NavBar items={items} />);
    expect(screen.getByText("ℹ")).toBeInTheDocument();
  });

  it("fires onChange on item click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <NavBar items={items} onChange={onChange} />,
    );
    await user.click(screen.getByText("Home"));
    expect(onChange).toHaveBeenCalledWith("home");
  });

  it("supports controlled value", () => {
    const { container } = renderWithHarbor(
      <NavBar items={items} value="about" />,
    );
    // Active item should have text-white class
    const aboutLink = screen.getByText("About").closest("a");
    expect(aboutLink?.className).toContain("text-white");
  });

  it("renders href on items", () => {
    const { container } = renderWithHarbor(<NavBar items={items} />);
    const links = container.querySelectorAll("a");
    const contactLink = Array.from(links).find((a) =>
      a.textContent?.includes("Contact"),
    );
    expect(contactLink?.getAttribute("href")).toBe("/contact");
  });

  it("renders as header element", () => {
    renderWithHarbor(<NavBar items={items} />);
    expect(document.querySelector("header")).toBeTruthy();
  });

  it("applies glass class", () => {
    renderWithHarbor(<NavBar items={items} />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("glass");
  });

  it("applies custom className", () => {
    renderWithHarbor(<NavBar items={items} className="my-nav" />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("my-nav");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<NavBar items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
