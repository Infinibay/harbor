import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("is invisible by default", () => {
    renderWithHarbor(
      <Tooltip content="Help text">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });

  it("appears on hover after the delay", async () => {
    const { user } = renderWithHarbor(
      <Tooltip content="Help text" delay={0}>
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    await waitFor(
      () => expect(screen.getByText("Help text")).toBeInTheDocument(),
      { timeout: 500 },
    );
  });

  it("disappears on unhover", async () => {
    const { user } = renderWithHarbor(
      <Tooltip content="Help text" delay={0}>
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    await user.hover(trigger);
    await waitFor(() =>
      expect(screen.getByText("Help text")).toBeInTheDocument(),
    );
    await user.unhover(trigger);
    await waitFor(
      () => expect(screen.queryByText("Help text")).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });

  it("a11y: no violations (trigger only, closed)", async () => {
    const { baseElement } = renderWithHarbor(
      <Tooltip content="Help">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
