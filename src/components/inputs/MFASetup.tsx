import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { Wizard } from "./Wizard";

export interface MFASetupProps {
  /** The user's identifier (email, username) — baked into the otpauth URI. */
  user: string;
  /** Issuer label shown in the authenticator app. */
  issuer?: string;
  /** Pre-generated shared secret (base32). Caller generates on the server. */
  secret: string;
  /** Pre-generated recovery codes. */
  recoveryCodes: readonly string[];
  /** Called when the user submits the code for validation. Return
   *  `true` to advance, a string to surface an error, or `false` for a
   *  generic "invalid" message. Defaults to naive length check. */
  onVerify?: (code: string) => Promise<true | false | string> | true | false | string;
  /** Called when the flow completes successfully. */
  onComplete?: () => void;
  /** QR renderer — receives the otpauth URI. If omitted, renders a
   *  text fallback + manual secret. Harbor stays dep-free. */
  renderQR?: (uri: string) => React.ReactNode;
  className?: string;
}

function otpauthURI({
  user,
  issuer,
  secret,
}: {
  user: string;
  issuer?: string;
  secret: string;
}): string {
  const label = encodeURIComponent(issuer ? `${issuer}:${user}` : user);
  const params = new URLSearchParams({ secret });
  if (issuer) params.set("issuer", issuer);
  return `otpauth://totp/${label}?${params.toString()}`;
}

/** 3-step MFA setup wizard: scan QR → enter code → save recovery codes.
 *  Reuses the `Wizard` primitive; caller provides pre-generated secret +
 *  recovery codes (server-generated is the secure default).
 *
 *  QR rendering is delegated — pass `renderQR={(uri) => <QRCode ... />}`
 *  to plug in `qrcode.react` or any other library. Without it, the user
 *  sees the `otpauth://` URI and a copyable manual secret. */
export function MFASetup({
  user,
  issuer = "Infinibay",
  secret,
  recoveryCodes,
  onVerify,
  onComplete,
  renderQR,
  className,
}: MFASetupProps) {
  const [code, setCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [savedCodes, setSavedCodes] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const uri = useMemo(() => otpauthURI({ user, issuer, secret }), [user, issuer, secret]);

  const steps = [
    {
      id: "scan",
      label: "Scan",
      description: "Scan the QR code with your authenticator app.",
      content: (
        <div className="flex flex-col gap-3 items-center">
          <div className="w-40 h-40 rounded-lg border border-white/10 bg-white/5 grid place-items-center overflow-hidden">
            {renderQR ? (
              renderQR(uri)
            ) : (
              <code className="text-[10px] text-white/60 font-mono text-center break-all px-2">
                {uri}
              </code>
            )}
          </div>
          <details className="text-xs text-white/60 cursor-pointer self-start">
            <summary>Can't scan? Enter secret manually</summary>
            <div className="mt-2 flex items-center gap-2">
              <code className="text-xs font-mono tabular-nums bg-white/5 border border-white/10 rounded px-2 py-1 text-white">
                {secret}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(secret).catch(() => {});
                  setCopiedSecret(true);
                  setTimeout(() => setCopiedSecret(false), 1500);
                }}
                className="text-xs text-white/70 hover:text-white"
              >
                {copiedSecret ? "✓ copied" : "Copy"}
              </button>
            </div>
          </details>
        </div>
      ),
    },
    {
      id: "verify",
      label: "Verify",
      description: "Enter the 6-digit code from your app.",
      content: (
        <div className="flex flex-col gap-3 w-full">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setVerifyError(null);
            }}
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            autoFocus
            className="text-2xl tabular-nums font-mono text-center tracking-[0.6em] bg-white/5 border border-white/10 rounded-md px-3 py-3 outline-none focus:border-fuchsia-400/50 text-white"
          />
          {verifyError ? (
            <div className="text-xs text-rose-300">{verifyError}</div>
          ) : null}
        </div>
      ),
      validate: async () => {
        const result = await Promise.resolve(
          onVerify ? onVerify(code) : code.length === 6 && /^\d{6}$/.test(code),
        );
        if (result === true) return true;
        setVerifyError(typeof result === "string" ? result : "Invalid code");
        return false;
      },
    },
    {
      id: "codes",
      label: "Recovery",
      description: "Store these codes somewhere safe. Each works once.",
      content: (
        <div className="flex flex-col gap-3 w-full">
          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((c) => (
              <code
                key={c}
                className="text-xs tabular-nums font-mono bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-center"
              >
                {c}
              </code>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                navigator.clipboard
                  ?.writeText(recoveryCodes.join("\n"))
                  .catch(() => {});
              }}
              className="text-white/70 hover:text-white"
            >
              Copy all
            </button>
            <label className="flex items-center gap-2 text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={savedCodes}
                onChange={(e) => setSavedCodes(e.target.checked)}
              />
              I've saved these codes somewhere safe
            </label>
          </div>
        </div>
      ),
      validate: () => (savedCodes ? true : "Confirm you've saved the codes."),
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      <Wizard steps={steps} onComplete={onComplete} />
    </div>
  );
}
