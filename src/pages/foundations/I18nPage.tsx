import { useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
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

export function I18nPage() {
  const [locale, setLocale] = useState<LocaleCode>("en");

  return (
    <HarborI18nProvider locales={[en, es, ar]} locale={locale} onLocaleChange={(c) => setLocale(c as LocaleCode)}>
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
    {
      id: "a",
      label: "Account",
      content: <FormField label={t("harbor.field.optional") + " name"}><TextField /></FormField>,
    },
    {
      id: "b",
      label: "Billing",
      content: <FormField label="Plan"><TextField /></FormField>,
    },
    {
      id: "c",
      label: "Review",
      content: <p className="text-sm text-white/70">Review your entries.</p>,
    },
  ];

  const commands: Command[] = [
    { id: "c1", label: "Open settings", action: () => {} },
    { id: "c2", label: "Toggle theme", action: () => {} },
    { id: "c3", label: "Restart workspace", action: () => {} },
  ];

  return (
    <Group
      id="i18n"
      title="I18n · internationalization"
      desc="Locale switch + RTL direction flow through every Harbor component via the HarborI18nProvider."
    >
      <Demo title="Locale switcher" hint="Current locale + direction" intensity="soft" wide>
        <Col>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Locale
            </span>
            {([
              ["en", "English"],
              ["es", "Español"],
              ["ar", "العربية (RTL)"],
            ] as const).map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  locale === code
                    ? "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-100"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ms-3 text-xs text-white/50">
              <code className="font-mono">dir={direction}</code> ·{" "}
              <code className="font-mono">{`<html dir="${direction}">`}</code>
            </span>
          </div>
        </Col>
      </Demo>

      <Demo title="FormField + labels" hint="(optional) + required * follow the catalog." intensity="soft">
        <Col>
          <FormField label="Email" required>
            <TextField placeholder="you@company.com" />
          </FormField>
          <FormField label="Phone" optional>
            <TextField placeholder="+54 11 5000 0000" />
          </FormField>
          <FormField label="Region">
            <Select
              value="us"
              onChange={() => {}}
              options={[
                { value: "us", label: "US" },
                { value: "eu", label: "EU" },
                { value: "ar", label: "LATAM" },
              ]}
            />
          </FormField>
        </Col>
      </Demo>

      <Demo title="Wizard · translated footer" hint="Back / Step N of M / Next all come from the catalog." intensity="soft">
        <Wizard steps={wizardSteps} />
      </Demo>

      <Demo title="Dialog · translated close label" intensity="soft">
        <Col>
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Confirm"
            description="Close button aria-label is translated."
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
            <p className="text-white/70 text-sm">Mirror the page direction, try it in Arabic.</p>
          </Dialog>
        </Col>
      </Demo>

      <Demo title="CommandPalette · translated chrome" intensity="soft">
        <Col>
          <Button onClick={() => setPalOpen(true)}>Open palette</Button>
          <CommandPalette
            open={palOpen}
            onOpenChange={setPalOpen}
            commands={commands}
          />
        </Col>
      </Demo>

      <Demo title="Intl formatters" hint="Date / number / relative time per locale" intensity="soft" wide>
        <Col className="gap-2 text-sm text-white/80">
          <div>
            <span className="text-white/40">Date:</span>{" "}
            {formatDate(new Date("2026-04-24T12:00:00Z"), {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </div>
          <div>
            <span className="text-white/40">Number:</span>{" "}
            {formatNumber(1234567.89)}
          </div>
          <div>
            <span className="text-white/40">Currency:</span>{" "}
            {formatNumber(19.99, { style: "currency", currency: "USD" })}
          </div>
          <div>
            <span className="text-white/40">Relative:</span>{" "}
            {formatRelative(-60 * 60 * 24 * 2)} · {formatRelative(60 * 30)}
          </div>
        </Col>
      </Demo>

      <Demo title="Message catalog · plurals" hint="ICU plural branches, locale-aware number formatting" intensity="soft" wide>
        <Col className="gap-1 text-sm text-white/80 font-mono">
          <PluralSample count={0} />
          <PluralSample count={1} />
          <PluralSample count={3} />
          <PluralSample count={12345} />
        </Col>
      </Demo>
    </Group>
  );
}

function PluralSample({ count }: { count: number }) {
  const { t } = useT();
  return (
    <div>
      <span className="text-white/40">count={count}:</span>{" "}
      {t("harbor.validation.minLength", { min: count })}
    </div>
  );
}
