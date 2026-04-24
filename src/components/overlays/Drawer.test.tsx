import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("does not render its body when closed", () => {
    renderWithHarbor(
      <Drawer open={false} onClose={() => {}}>
        <p>Settings</p>
      </Drawer>,
    );
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders its body when open", () => {
    renderWithHarbor(
      <Drawer open onClose={() => {}}>
        <p>Settings</p>
      </Drawer>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Drawer open onClose={onClose}>
        <p>Body</p>
      </Drawer>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a11y: no violations when open", async () => {
    const { baseElement } = renderWithHarbor(
      <Drawer open onClose={() => {}} title="Settings">
        <p>Content</p>
      </Drawer>,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
