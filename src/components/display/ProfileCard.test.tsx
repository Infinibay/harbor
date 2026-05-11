import { describe, expect, it } from "vitest";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ProfileCard } from "./ProfileCard";

describe("ProfileCard", () => {
  it("renders the avatar image when avatar is provided", () => {
    const { container } = renderWithHarbor(
      <ProfileCard
        name="Ana Torres"
        handle="ana"
        avatar="/ana.png"
        role="Design systems"
      />,
    );

    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "/ana.png");
    expect(image).toHaveAttribute("alt", "");
  });
});
