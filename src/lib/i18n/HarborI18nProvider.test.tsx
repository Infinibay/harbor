import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HarborI18nProvider } from "./HarborI18nProvider";
import { useT } from "./useT";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { ar } from "./locales/ar";

function Consumer() {
  const { t, code, direction, setLocale } = useT();
  return (
    <div>
      <span data-testid="optional">{t("harbor.field.optional")}</span>
      <span data-testid="step">
        {t("harbor.wizard.stepOfN", { current: 1, total: 3 })}
      </span>
      <span data-testid="code">{code}</span>
      <span data-testid="dir">{direction}</span>
      <button type="button" onClick={() => setLocale("es")}>es</button>
      <button type="button" onClick={() => setLocale("ar")}>ar</button>
    </div>
  );
}

describe("HarborI18nProvider", () => {
  it("translates a key from the active catalog", () => {
    render(
      <HarborI18nProvider locales={[en, es]} defaultLocale="es">
        <Consumer />
      </HarborI18nProvider>,
    );
    expect(screen.getByTestId("optional").textContent).toBe("(opcional)");
  });

  it("expands plural templates with locale-aware numbers", () => {
    render(
      <HarborI18nProvider locales={[en, es]} defaultLocale="en">
        <Consumer />
      </HarborI18nProvider>,
    );
    expect(screen.getByTestId("step").textContent).toBe("Step 1 of 3");
  });

  it("falls back to the fallback catalog for missing keys", () => {
    const sparse = { ...es, messages: { ...es.messages } };
    delete (sparse.messages as any)["harbor.field.optional"];
    render(
      <HarborI18nProvider
        locales={[en, sparse]}
        defaultLocale="es"
        fallback="en"
      >
        <Consumer />
      </HarborI18nProvider>,
    );
    expect(screen.getByTestId("optional").textContent).toBe("(optional)");
  });

  it("returns the raw key when every catalog misses it", () => {
    function Missing() {
      const { t } = useT();
      return <span data-testid="m">{t("harbor.definitely.missing.key")}</span>;
    }
    render(
      <HarborI18nProvider locales={[en]} defaultLocale="en">
        <Missing />
      </HarborI18nProvider>,
    );
    expect(screen.getByTestId("m").textContent).toBe(
      "harbor.definitely.missing.key",
    );
  });

  it("flips the direction and sets `dir` on <html> for an RTL locale", () => {
    render(
      <HarborI18nProvider locales={[en, ar]} defaultLocale="ar">
        <Consumer />
      </HarborI18nProvider>,
    );
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(document.documentElement.getAttribute("lang")).toBe("ar");
  });

  it("setLocale switches locale and updates direction", async () => {
    const user = userEvent.setup();
    render(
      <HarborI18nProvider locales={[en, es, ar]} defaultLocale="en">
        <Consumer />
      </HarborI18nProvider>,
    );
    expect(screen.getByTestId("optional").textContent).toBe("(optional)");
    expect(screen.getByTestId("dir").textContent).toBe("ltr");

    await user.click(screen.getByRole("button", { name: "ar" }));
    expect(screen.getByTestId("optional").textContent).toBe("(اختياري)");
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
  });

  it("outside a provider, useT falls back to identity translation", () => {
    function Bare() {
      const { t, code } = useT();
      return (
        <>
          <span data-testid="t">{t("some.key")}</span>
          <span data-testid="c">{code}</span>
        </>
      );
    }
    render(<Bare />);
    expect(screen.getByTestId("t").textContent).toBe("some.key");
    expect(screen.getByTestId("c").textContent).toBe("en");
  });

  it("sync writes `dir` on document root", () => {
    const { unmount } = render(
      <HarborI18nProvider locales={[en]} defaultLocale="en">
        <Consumer />
      </HarborI18nProvider>,
    );
    // Let the syncHtmlAttrs effect run.
    act(() => {});
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
    unmount();
  });
});
