import { render, screen } from "@testing-library/react";
import { HarborProvider } from "./HarborProvider";

describe("HarborProvider adaptive target scope", () => {
  it("renders children without an extra adaptive wrapper by default", () => {
    const { container } = render(
      <HarborProvider>
        <div data-testid="child" />
      </HarborProvider>,
    );

    expect(screen.getByTestId("child")).toBeTruthy();
    expect(container.querySelector("[data-harbor-target]")).toBeNull();
  });

  it("applies desktop compact target variables on a scoped wrapper", () => {
    render(
      <HarborProvider target="desktop-app" density="compact">
        <div>App</div>
      </HarborProvider>,
    );

    const scope = document.querySelector("[data-harbor-target='desktop-app']");
    expect(scope?.getAttribute("data-harbor-density")).toBe("compact");
    expect((scope as HTMLElement).style.getPropertyValue("--harbor-target-control-height")).toBe("30px");
    expect((scope as HTMLElement).style.getPropertyValue("--harbor-target-radius")).toBe("3px");
  });

  it("lets local adaptive token overrides win over presets", () => {
    render(
      <HarborProvider
        target="webapp"
        density="comfortable"
        adaptiveTokens={{ controlHeight: "46px", radius: "12px" }}
      >
        <div>Webapp</div>
      </HarborProvider>,
    );

    const scope = document.querySelector("[data-harbor-target='webapp']");
    expect((scope as HTMLElement).style.getPropertyValue("--harbor-target-control-height")).toBe("46px");
    expect((scope as HTMLElement).style.getPropertyValue("--harbor-target-radius")).toBe("12px");
  });
});
