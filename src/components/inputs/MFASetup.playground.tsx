import { MFASetup } from "./MFASetup";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const recoveryCodes = [
  "8h2k-a91f",
  "p3z9-x4mq",
  "2vlm-7rkb",
  "9qod-1tcj",
  "7eag-5wpu",
  "rfvy-bn3z",
  "j40k-cm8e",
  "u5sx-bv26",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MFASetupDemo(props: any) {
  return (
    <div className="w-[520px]">
      <MFASetup
        user="andres@infinibay.dev"
        issuer="Infinibay"
        secret="JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"
        recoveryCodes={recoveryCodes}
        {...props}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MFASetupDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    user: { type: "text", default: "andres@infinibay.dev" },
    issuer: { type: "text", default: "Infinibay" },
  },
  variants: [
    { label: "Default", props: {} },
    {
      label: "Always-valid verify",
      props: { onVerify: () => true as const },
    },
  ],
  events: [
    {
      name: "onVerify",
      signature:
        "(code: string) => Promise<true | false | string> | true | false | string",
      description:
        "Return true to advance, a string for a custom error, false for a generic invalid message.",
    },
    { name: "onComplete", signature: "() => void" },
  ],
  notes:
    "Without renderQR the otpauth:// URI is shown verbatim. Pass a renderQR prop to plug in qrcode.react. The default verifier just checks length === 6.",
};
