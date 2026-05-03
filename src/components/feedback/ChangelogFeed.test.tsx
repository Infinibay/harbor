import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  ChangelogFeed,
  type ChangelogEntry,
} from "./ChangelogFeed";

const entries: ChangelogEntry[] = [
  {
    version: "1.2.0",
    date: new Date(2025, 0, 15),
    title: "New features",
    sections: [
      {
        label: "Features",
        items: [
          { text: "Added dark mode", kind: "feature" },
          { text: "Improved perf", kind: "improvement" },
        ],
      },
    ],
  },
  {
    version: "1.1.0",
    date: new Date(2024, 11, 1),
    collapsed: true,
    sections: [
      {
        label: "Fixes",
        items: [
          { text: "Fixed crash", kind: "fix" },
          { text: "Security patch", kind: "security" },
        ],
      },
    ],
  },
];

describe("ChangelogFeed", () => {
  it("renders version numbers", () => {
    const { container } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(container.textContent).toContain("1.2.0");
    expect(container.textContent).toContain("1.1.0");
  });

  it("renders version titles", () => {
    renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(screen.getByText(/New features/)).toBeInTheDocument();
  });

  it("renders section labels", () => {
    const { container } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(container.textContent).toContain("Features");
  });

  it("renders item text for expanded entry", () => {
    const { container } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(container.textContent).toContain("Added dark mode");
    expect(container.textContent).toContain("Improved perf");
  });

  it("renders kind badges", () => {
    const { container } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(container.textContent).toContain("New");
    expect(container.textContent).toContain("Better");
  });

  it("renders filter chips when showFilter=true (default)", () => {
    renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("hides filter chips when showFilter=false", () => {
    renderWithHarbor(<ChangelogFeed entries={entries} showFilter={false} />);
    expect(screen.queryByText("All")).toBeNull();
  });

  it("collapses second entry by default", () => {
    renderWithHarbor(<ChangelogFeed entries={entries} />);
    // Second entry is collapsed, so fix items should not be visible
    expect(screen.queryByText("Fixed crash")).toBeNull();
  });

  it("expands collapsed entry on header click", async () => {
    const { user } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    // Click the collapsed version header
    await user.click(screen.getByText("1.1.0"));
    expect(screen.getByText("Fixed crash")).toBeInTheDocument();
  });

  it("collapses expanded entry on header click", async () => {
    const { user } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    // Click the expanded version header
    await user.click(screen.getByText("1.2.0"));
    // AnimatePresence exit animation keeps element briefly — use waitFor
    await waitFor(() => {
      expect(screen.queryByText("Added dark mode")).toBeNull();
    });
  });
  it("filters items by kind when filter chip clicked", async () => {
    const { user } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    // The filter chip for "New" is a <button> — disambiguate from the badge <span>
    const filterBtns = screen.getAllByText("New");
    const chipBtn = filterBtns.find(
      (el) => el.tagName === "BUTTON",
    )!;
    await user.click(chipBtn);
    // Only feature items should show
    expect(screen.getByText("Added dark mode")).toBeInTheDocument();
    expect(screen.queryByText("Improved perf")).toBeNull();
  });

  it("renders item links when href provided", async () => {
    const linkEntries: ChangelogEntry[] = [
      {
        version: "0.1.0",
        date: new Date(2025, 0, 1),
        sections: [
          {
            label: "Changes",
            items: [
              { text: "See PR", kind: "feature", href: "https://github.com/pr/1" },
            ],
          },
        ],
      },
    ];
    const { container } = renderWithHarbor(
      <ChangelogFeed entries={linkEntries} />,
    );
    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://github.com/pr/1");
  });

  it("renders empty entries gracefully", () => {
    const { container } = renderWithHarbor(<ChangelogFeed entries={[]} />);
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders all kind labels correctly", () => {
    const allKinds: ChangelogEntry[] = [
      {
        version: "2.0.0",
        date: new Date(2025, 5, 1),
        sections: [
          {
            label: "All",
            items: [
              { text: "feat", kind: "feature" },
              { text: "imp", kind: "improvement" },
              { text: "fix", kind: "fix" },
              { text: "sec", kind: "security" },
              { text: "brk", kind: "breaking" },
            ],
          },
        ],
      },
    ];
    const { container } = renderWithHarbor(<ChangelogFeed entries={allKinds} />);
    expect(container.textContent).toContain("New");
    expect(container.textContent).toContain("Better");
    expect(container.textContent).toContain("Fixed");
    expect(container.textContent).toContain("Security");
    expect(container.textContent).toContain("Breaking");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ChangelogFeed entries={entries} className="my-feed" />,
    );
    expect(container.querySelector(".my-feed")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ChangelogFeed entries={entries} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
