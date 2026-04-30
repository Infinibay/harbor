import {
  AuditLog,
  AuditEntry,
  AuditDiff,
} from "./AuditLog";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const HOUR = 1000 * 60 * 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuditLogDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <AuditLog>
        <AuditEntry
          actor={{ name: "Ana" }}
          verb="deleted"
          target="auth-service"
          at={Date.now() - 0.5 * HOUR}
          severity="warn"
          kind="security"
          onClick={() => props.onEntryClick?.("svc-auth")}
        >
          <AuditDiff from="enabled" to="disabled" />
          <p>Reason: rotation policy required regenerating credentials.</p>
        </AuditEntry>

        <AuditEntry
          actor={{ name: "Bruno" }}
          verb="rolled back"
          target="billing-api v2.4.1"
          at={Date.now() - 4 * HOUR}
          severity="critical"
          kind="deploy"
          onClick={() => props.onEntryClick?.("billing")}
        >
          <AuditDiff from="v2.4.1" to="v2.4.0" />
        </AuditEntry>

        <AuditEntry
          actor={{ name: "Cinto" }}
          verb="invited"
          target="diego@infinibay.io"
          at={Date.now() - 26 * HOUR}
          kind="users"
          onClick={() => props.onEntryClick?.("invite")}
        />

        <AuditEntry
          actor={{ name: "system" }}
          verb="ran"
          target="nightly migration"
          at={Date.now() - 30 * HOUR}
          kind="job"
          onClick={() => props.onEntryClick?.("job")}
        />
      </AuditLog>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: AuditLogDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {},
  events: [
    {
      name: "onEntryClick",
      signature: "(entryId: string) => void",
      description:
        "Each <AuditEntry> takes a regular onClick — the demo wires them to a single handler so you can see when a row fires.",
    },
  ],
  notes:
    "Click a row with detail content to expand it. Rows without children just fire onClick.",
};
