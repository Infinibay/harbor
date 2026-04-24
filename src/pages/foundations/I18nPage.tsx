import { useState } from "react";
import { Group, Demo, Col, Row } from "../../showcase/ShowcaseCard";
import {
  ActionRow,
  Button,
  CommandPalette,
  Dialog,
  FormField,
  Select,
  TextField,
  Wizard,
  type Command,
  type WizardStep,
} from "../../components";
import {
  HarborI18nProvider,
  ar,
  en,
  es,
  useT,
} from "../../lib/i18n";

type LocaleCode = "en" | "es" | "ar";

const LOCALE_BUTTONS: Array<{ code: LocaleCode; label: string; hint: string }> = [
  { code: "en", label: "English", hint: "ltr" },
  { code: "es", label: "Español", hint: "ltr" },
  { code: "ar", label: "العربية", hint: "rtl" },
];

export function I18nPage() {
  const [locale, setLocale] = useState<LocaleCode>("en");

  return (
    <HarborI18nProvider
      locales={[en, es, ar]}
      locale={locale}
      onLocaleChange={(c) => setLocale(c as LocaleCode)}
    >
      <I18nPageBody locale={locale} setLocale={setLocale} />
    </HarborI18nProvider>
  );
}

interface BodyProps {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
}

function I18nPageBody({ locale, setLocale }: BodyProps) {
  const { t, direction, formatDate, formatNumber, formatRelative } = useT();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [palOpen, setPalOpen] = useState(false);

  const wizardSteps: WizardStep[] = [
    { id: "a", label: "Account", content: <div className="text-sm text-white/70">Step 1 body</div> },
    { id: "b", label: "Billing", content: <div className="text-sm text-white/70">Step 2 body</div> },
    { id: "c", label: "Review", content: <div className="text-sm text-white/70">Step 3 body</div> },
  ];

  const commands: Command[] = [
    { id: "c1", label: "Open settings", action: () => {} },
    { id: "c2", label: "Toggle theme", action: () => {} },
    { id: "c3", label: "Restart workspace", action: () => {} },
  ];

  // Keys whose live values we'll surface in the "translation table" demo
  // so changes are unmissable when the user flips locale.
  const KEY_SAMPLES: Array<{ key: string; vars?: Record<string, number> }> = [
    { key: "harbor.field.optional" },
    { key: "harbor.action.back" },
    { key: "harbor.action.next" },
    { key: "harbor.action.finish" },
    { key: "harbor.action.cancel" },
    { key: "harbor.action.save" },
    { key: "harbor.action.close" },
    { key: "harbor.wizard.defaultError" },
    { key: "harbor.wizard.stepOfN", vars: { current: 2, total: 5 } },
    { key: "harbor.commandPalette.placeholder" },
    { key: "harbor.commandPalette.title" },
    { key: "harbor.select.placeholder" },
    { key: "harbor.search.placeholder" },
    { key: "harbor.validation.required" },
    { key: "harbor.validation.minLength", vars: { min: 1 } },
    { key: "harbor.validation.minLength", vars: { min: 8 } },
  ];

  return (
    <Group
      id="i18n"
      title="I18n · internationalization"
      desc="Locale + RTL direction flow through every Harbor component via HarborI18nProvider. Click a locale and watch every translated string + <html dir> flip instantly."
    >
      <Demo
        title="Locale switcher"
        hint="The only way to change locale on this page. Click a flag — every translatable string below updates in place."
        intensity="strong"
        wide
      >
        <Col className="gap-3">
          <Row className="gap-2 flex-wrap items-center">
            {LOCALE_BUTTONS.map((b) => (
              <button
                key={b.code}
                type="button"
                onClick={() => setLocale(b.code)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  locale === b.code
                    ? "bg-fuchsia-500/25 border-fuchsia-400/60 text-fuchsia-100"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="font-medium">{b.label}</span>
                <span className="ms-2 text-[10px] uppercase tracking-widest text-white/50">
                  {b.code} · {b.hint}
                </span>
              </button>
            ))}
          </Row>
          <div className="text-xs text-white/55 font-mono">
            active code: <span className="text-fuchsia-200">{locale}</span> ·
            dir: <span className="text-fuchsia-200">{direction}</span> ·
            html&nbsp;<code>&lt;html dir="{direction}"&gt;</code>
          </div>
        </Col>
      </Demo>

      <Demo
        title="Live message catalog"
        hint="Every row re-runs t(key) on each render — watch the right column flip."
        intensity="soft"
        wide
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/40">
                <th className="text-start py-2 pe-4">key</th>
                <th className="text-start py-2 pe-4">t(key) → {locale}</th>
              </tr>
            </thead>
            <tbody>
              {KEY_SAMPLES.map(({ key, vars }, i) => (
                <tr
                  key={`${key}-${i}`}
                  className="border-t border-white/[0.04]"
                >
                  <td className="py-1.5 pe-4 text-white/50">
                    {key}
                    {vars ? (
                      <span className="text-white/30">
                        {" "}
                        ({Object.entries(vars).map(([k, v]) => `${k}=${v}`).join(", ")})
                      </span>
                    ) : null}
                  </td>
                  <td className="py-1.5 pe-4 text-white">
                    {t(key, vars)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Demo>

      <Demo
        title="FormField chrome"
        hint="`(optional)` and the required `*` come from the catalog. Labels (Email/Phone) stay hardcoded on purpose so you can see which parts i18n owns."
        intensity="soft"
      >
        <Col>
          <FormField label="Email" required>
            <TextField placeholder="you@company.com" />
          </FormField>
          <FormField label="Phone" optional>
            <TextField placeholder="+54 11 5000 0000" />
          </FormField>
        </Col>
      </Demo>

      <Demo
        title="Wizard — footer flips live"
        hint="Back / Step N of M / Next pulled from the catalog. Plural rule applies in the step indicator."
        intensity="soft"
      >
        <Wizard steps={wizardSteps} />
      </Demo>

      <Demo
        title="Dialog — translated aria-label"
        hint="The close `×` button's aria-label comes from `harbor.action.close`."
        intensity="soft"
      >
        <Col>
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Confirmation"
            description="Inspect the close button's aria-label in DevTools — it follows the active locale."
            footer={
              <ActionRow>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  {t("harbor.action.cancel")}
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  {t("harbor.action.save")}
                </Button>
              </ActionRow>
            }
          >
            <p className="text-white/70 text-sm">
              In Arabic (rtl) the dialog itself mirrors: close button moves
              from end-right to end-left automatically via CSS logical props.
            </p>
          </Dialog>
        </Col>
      </Demo>

      <Demo
        title="CommandPalette — translated chrome"
        hint="Placeholder, title, and ESC kbd all localized."
        intensity="soft"
      >
        <Col>
          <Button onClick={() => setPalOpen(true)}>Open palette</Button>
          <CommandPalette
            open={palOpen}
            onOpenChange={setPalOpen}
            commands={commands}
          />
        </Col>
      </Demo>

      <Demo
        title="Intl formatters"
        hint="Date / number / currency / relative time per locale — no hardcoded formatting anywhere."
        intensity="soft"
        wide
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <IntlRow
            label="Date (long)"
            value={formatDate(new Date("2026-04-24T12:00:00Z"), {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          />
          <IntlRow label="Number" value={formatNumber(1234567.89)} />
          <IntlRow
            label="Currency (USD)"
            value={formatNumber(19.99, { style: "currency", currency: "USD" })}
          />
          <IntlRow label="Percent" value={formatNumber(0.42, { style: "percent" })} />
          <IntlRow label="Relative · −2 days" value={formatRelative(-60 * 60 * 24 * 2)} />
          <IntlRow label="Relative · +30 min" value={formatRelative(60 * 30)} />
        </div>
      </Demo>

      <Demo
        title="Select (not a locale!)"
        hint="Just a regular Select — it does NOT change the locale. Use the buttons at the top."
        intensity="soft"
      >
        <FormField label="Region">
          <Select
            value="us"
            onChange={() => {}}
            options={[
              { value: "us", label: "United States" },
              { value: "eu", label: "Europe" },
              { value: "latam", label: "Latin America" },
            ]}
          />
        </FormField>
      </Demo>
    </Group>
  );
}

function IntlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-white/[0.04] pb-1.5">
      <span className="text-white/40 text-xs uppercase tracking-widest min-w-[8.5rem]">
        {label}
      </span>
      <span className="text-white font-mono text-sm">{value}</span>
    </div>
  );
}
