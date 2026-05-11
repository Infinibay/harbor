import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ExportMenu } from "./ExportMenu";

describe("ExportMenu", () => {
  it("exposes expanded state on the trigger", async () => {
    const { user } = renderWithHarbor(<ExportMenu onExport={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: /export/i });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("emits structured export options", async () => {
    const onExport = vi.fn();
    const { user } = renderWithHarbor(
      <ExportMenu onExport={onExport} formats={["csv", "json"]} />,
    );

    await user.click(screen.getByRole("button", { name: /export/i }));
    await user.click(screen.getByRole("button", { name: /JSON/i }));
    await user.click(screen.getByRole("button", { name: /^Export$/i }));

    expect(onExport).toHaveBeenCalledWith({
      format: "json",
      includeHeaders: true,
      currentFilterOnly: true,
      allColumns: false,
    });
  });
});
