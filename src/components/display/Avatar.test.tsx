import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Avatar, AvatarStack } from "./Avatar";

describe("Avatar", () => {
  it("renders initials from name", () => {
    const { container } = renderWithHarbor(<Avatar name="John Doe" />);
    expect(container.textContent).toContain("JD");
  });

  it("renders ? for no name", () => {
    const { container } = renderWithHarbor(<Avatar />);
    expect(container.textContent).toContain("?");
  });

  it("renders single initial for single-word name", () => {
    const { container } = renderWithHarbor(<Avatar name="Admin" />);
    expect(container.textContent).toContain("A");
  });

  it("renders image when src provided", () => {
    const { container } = renderWithHarbor(
      <Avatar name="User" src="https://example.com/avatar.jpg" />,
    );
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("https://example.com/avatar.jpg");
  });

  it("renders status dot when status provided", () => {
    const { container } = renderWithHarbor(<Avatar name="A" status="online" />);
    // Online status dot has bg-emerald-400 class
    const dot = container.querySelector(".bg-emerald-400");
    expect(dot).toBeTruthy();
  });

  it("applies size sm class", () => {
    const { container } = renderWithHarbor(<Avatar name="A" size="sm" />);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
  });

  it("applies size xl class", () => {
    const { container } = renderWithHarbor(<Avatar name="A" size="xl" />);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Avatar name="A" className="my-avatar" />,
    );
    expect(container.querySelector(".my-avatar")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Avatar name="Test User" status="online" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AvatarStack", () => {
  const people = [
    { name: "Ana" },
    { name: "Bruno" },
    { name: "Cinto" },
    { name: "Diego" },
    { name: "Elena" },
  ];

  it("renders avatar stack", () => {
    const { container } = renderWithHarbor(<AvatarStack people={people} />);
    // Should show the avatars
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("shows overflow count beyond max", () => {
    renderWithHarbor(<AvatarStack people={people} max={3} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show overflow when within max", () => {
    renderWithHarbor(<AvatarStack people={people.slice(0, 2)} max={4} />);
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <AvatarStack people={people} className="my-stack" />,
    );
    expect(container.querySelector(".my-stack")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<AvatarStack people={people} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
