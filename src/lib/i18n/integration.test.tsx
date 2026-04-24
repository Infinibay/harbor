import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { HarborI18nProvider } from "./HarborI18nProvider";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { ar } from "./locales/ar";
import { FormField } from "../../components/inputs/FormField";
import { TextField } from "../../components/inputs/TextField";
import { Wizard, type WizardStep } from "../../components/inputs/Wizard";

/** Mimics the I18n showcase page: a locale switcher that drives a
 *  controlled `HarborI18nProvider`, wrapped around real Harbor
 *  components. Proves that changing the switcher actually updates the
 *  translated chrome. */
function Fixture() {
  const [locale, setLocale] = useState<"en" | "es" | "ar">("en");
  return (
    <HarborI18nProvider
      locales={[en, es, ar]}
      locale={locale}
      onLocaleChange={(c) => setLocale(c as "en" | "es" | "ar")}
    >
      <div>
        <button type="button" onClick={() => setLocale("en")}>sw-en</button>
        <button type="button" onClick={() => setLocale("es")}>sw-es</button>
        <button type="button" onClick={() => setLocale("ar")}>sw-ar</button>

        <FormField label="Email" optional>
          <TextField />
        </FormField>

        <Wizard
          steps={
            [
              { id: "a", label: "A", content: <div /> },
              { id: "b", label: "B", content: <div /> },
            ] as WizardStep[]
          }
        />
      </div>
    </HarborI18nProvider>
  );
}

describe("i18n — end-to-end via real components", () => {
  it("the locale switcher actually flips the translated chrome", async () => {
    const user = userEvent.setup();
    render(<Fixture />);

    // English defaults.
    expect(screen.getByText("(optional)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 2/)).toBeInTheDocument();

    // Flip to Spanish.
    await user.click(screen.getByRole("button", { name: "sw-es" }));
    expect(screen.getByText("(opcional)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Atrás" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeInTheDocument();
    expect(screen.getByText(/Paso 1 de 2/)).toBeInTheDocument();
    expect(screen.queryByText("(optional)")).not.toBeInTheDocument();

    // Flip to Arabic + verify direction propagated to <html>.
    await user.click(screen.getByRole("button", { name: "sw-ar" }));
    expect(screen.getByText("(اختياري)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "رجوع" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "التالي" })).toBeInTheDocument();
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");

    // Back to English.
    await user.click(screen.getByRole("button", { name: "sw-en" }));
    expect(screen.getByText("(optional)")).toBeInTheDocument();
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
  });
});
