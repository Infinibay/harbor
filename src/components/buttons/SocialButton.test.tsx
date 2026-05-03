import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SocialButton, type SocialProvider } from "./SocialButton";

describe("SocialButton", () => {
  const providers: SocialProvider[] = [
    "github",
    "google",
    "apple",
    "microsoft",
    "x",
    "gitlab",
    "discord",
    "slack",
  ];

  it("renders default label for each provider", () => {
    for (const p of providers) {
      const { unmount } = renderWithHarbor(<SocialButton provider={p} />);
      expect(screen.getByRole("button", { name: /Continue with/ })).toBeInTheDocument();
      unmount();
    }
  });

  it("renders custom label", () => {
    renderWithHarbor(<SocialButton provider="github" label="Sign in" />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <SocialButton provider="github" onClick={onClick} />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies fullWidth class", () => {
    const { container } = renderWithHarbor(
      <SocialButton provider="github" fullWidth />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-full");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <SocialButton provider="github" className="extra" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("extra");
  });

  it("renders provider icon", () => {
    const { container } = renderWithHarbor(<SocialButton provider="github" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <SocialButton provider="github" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
