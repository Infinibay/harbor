import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { UptimeStrip } from "./UptimeStrip";

describe("UptimeStrip", () => {
  it("labels day buttons with date and status", () => {
    renderWithHarbor(
      <UptimeStrip
        length={1}
        days={[
          {
            date: "2026-05-11T00:00:00Z",
            status: "degraded",
            label: "Elevated latency",
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: /degraded/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Elevated latency/i })).toBeInTheDocument();
  });

  it("fires onDayClick with the selected day", async () => {
    const onDayClick = vi.fn();
    const { user } = renderWithHarbor(
      <UptimeStrip
        length={1}
        onDayClick={onDayClick}
        days={[{ date: "2026-05-11T00:00:00Z", status: "operational" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /operational/i }));
    expect(onDayClick).toHaveBeenCalledWith(
      expect.objectContaining({ status: "operational" }),
    );
  });
});
