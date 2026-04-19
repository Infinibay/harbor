import { useState } from "react";
import { Group, Demo, Col, Row } from "../../showcase/ShowcaseCard";
import {
  APIKeyCard,
  SSHKeyCard,
  RoleBadge,
} from "../../components";
import {
  PermissionMatrix,
  AuditLog,
  type AuditEntry,
  type PermissionCell,
  type PermissionPrincipal,
  type PermissionResource,
} from "../../components";
import { MFASetup } from "../../components";
import { Button } from "../../components";

const PRINCIPALS: PermissionPrincipal[] = [
  { id: "u-ada", label: "Ada Lovelace", kind: "user", avatar: "AL" },
  { id: "u-ken", label: "Ken Makino", kind: "user", avatar: "KM" },
  { id: "u-rie", label: "Rie Takahashi", kind: "user", avatar: "RT" },
  { id: "r-ops", label: "Ops", kind: "role", avatar: "🛠" },
  { id: "r-oncall", label: "On-call", kind: "role", avatar: "📟" },
];

const RESOURCES: PermissionResource[] = [
  { id: "vms:list", label: "vms:list", group: "Compute" },
  { id: "vms:create", label: "vms:create", group: "Compute" },
  { id: "vms:delete", label: "vms:delete", group: "Compute" },
  { id: "deploys:trigger", label: "deploys:trigger", group: "DevOps" },
  { id: "deploys:rollback", label: "deploys:rollback", group: "DevOps" },
  { id: "billing:read", label: "billing:read", group: "Billing" },
  { id: "billing:edit", label: "billing:edit", group: "Billing" },
];

const INITIAL_MATRIX: Record<string, PermissionCell> = {
  "u-ada:vms:list": "allow",
  "u-ada:vms:create": "allow",
  "u-ada:vms:delete": "allow",
  "u-ada:deploys:trigger": "allow",
  "u-ada:deploys:rollback": "allow",
  "u-ada:billing:read": "allow",
  "u-ada:billing:edit": "deny",
  "u-ken:vms:list": "allow",
  "u-ken:vms:create": "allow",
  "u-ken:deploys:trigger": "allow",
  "r-ops:vms:list": "allow",
  "r-ops:vms:create": "allow",
  "r-oncall:vms:list": "allow",
  "r-oncall:deploys:rollback": "allow",
};

const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "a1",
    at: Date.now() - 2 * 60_000,
    actor: { name: "Ada Lovelace" },
    verb: "rotated",
    target: "API key · deploy-bot",
    kind: "secret",
    severity: "warn",
    diff: { from: "sk_live_…old", to: "sk_live_…new" },
  },
  {
    id: "a2",
    at: Date.now() - 14 * 60_000,
    actor: { name: "Ken Makino" },
    verb: "approved",
    target: "PR #4217 · auth-v2",
    kind: "pr",
  },
  {
    id: "a3",
    at: Date.now() - 45 * 60_000,
    actor: { name: "Rie Takahashi" },
    verb: "deleted",
    target: "VM · legacy-billing",
    kind: "vm",
    severity: "critical",
    detail: "Decommission ticket INFRA-1820. Snapshot preserved.",
  },
  {
    id: "a4",
    at: Date.now() - 3 * 3600_000,
    actor: { name: "Ada Lovelace" },
    verb: "granted",
    target: "role · on-call to Bruno",
    kind: "access",
  },
  {
    id: "a5",
    at: Date.now() - 26 * 3600_000,
    actor: { name: "ci-bot" },
    verb: "deployed",
    target: "api-gateway v2.3.0",
    kind: "deploy",
    detail: "Rolling deploy · 4/4 pods · elapsed 58s.",
  },
  {
    id: "a6",
    at: Date.now() - 30 * 3600_000,
    actor: { name: "Ken Makino" },
    verb: "changed scope",
    target: "SSH key · ops-admin",
    kind: "secret",
    diff: { from: "root,deploy", to: "deploy" },
  },
];

const RECOVERY_CODES = [
  "A7XQ-12JP", "P5RM-8WKZ", "N2DC-4LBE", "Q9SH-16TY",
  "F3KJ-7VDL", "C4MN-9HRX", "W1BT-5GQS", "Z8PE-3UAY",
];

export function AccessPage() {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);
  const [showMFA, setShowMFA] = useState(false);

  function set(principalId: string, resourceId: string, next: PermissionCell) {
    setMatrix((prev) => ({ ...prev, [`${principalId}:${resourceId}`]: next }));
  }
  function bulkSet(changes: { principalId: string; resourceId: string; value: PermissionCell }[]) {
    setMatrix((prev) => {
      const next = { ...prev };
      for (const c of changes) next[`${c.principalId}:${c.resourceId}`] = c.value;
      return next;
    });
  }

  return (
    <Group
      id="access"
      title="Access · Security"
      desc="Permissions matrix · audit log · key management · MFA setup — the access stack every SaaS needs."
    >
      <Demo title="RoleBadge · per role" wide>
        <Row className="gap-2 flex-wrap items-center">
          <RoleBadge role="owner" icon />
          <RoleBadge role="admin" icon />
          <RoleBadge role="editor" icon />
          <RoleBadge role="viewer" icon />
          <RoleBadge role="guest" icon />
          <RoleBadge role="custom" icon label="Deploy-only" />
          <span className="w-px h-5 bg-white/10 mx-2" />
          <span className="text-xs text-white/50">sizes:</span>
          <RoleBadge role="admin" size="xs" />
          <RoleBadge role="admin" size="sm" />
          <RoleBadge role="admin" size="md" />
        </Row>
      </Demo>

      <Demo
        title="PermissionMatrix · tri-state cells"
        hint="Click a cell to cycle allow → deny → inherit · click header to bulk-toggle"
        wide
        intensity="soft"
      >
        <PermissionMatrix
          principals={PRINCIPALS}
          resources={RESOURCES}
          value={matrix}
          onChange={set}
          onBulkChange={bulkSet}
        />
      </Demo>

      <Demo
        title="AuditLog · grouped by day"
        hint="Rows are expandable when they carry detail or a diff"
        wide
        intensity="soft"
      >
        <AuditLog
          entries={AUDIT_ENTRIES}
          groupBy="day"
          kinds={["access", "secret", "deploy", "vm", "pr"]}
        />
      </Demo>

      <Demo title="APIKeyCard / SSHKeyCard" wide intensity="soft">
        <Col className="gap-3">
          <APIKeyCard
            label="Deploy bot · production"
            fingerprint="ak_8f02b9…0a47"
            scope="read:deploys, write:deploys"
            createdAt={Date.now() - 86 * 86400_000}
            lastUsed={Date.now() - 12 * 60_000}
            privileged
            onReveal={() => {}}
            onRotate={() => {}}
            onRevoke={() => {}}
          />
          <SSHKeyCard
            label="ops-admin"
            fingerprint="SHA256:mq9xOWgCs…ab1f"
            scope="deploy"
            createdAt={Date.now() - 200 * 86400_000}
            lastUsed={Date.now() - 2 * 86400_000}
            onRotate={() => {}}
            onRevoke={() => {}}
          />
        </Col>
      </Demo>

      <Demo
        title="MFASetup · 3-step wizard"
        hint="Scan QR → enter code → save recovery codes · BYO QR renderer"
        wide
        intensity="soft"
      >
        {showMFA ? (
          <MFASetup
            user="ada@infinibay.com"
            issuer="Infinibay"
            secret="JBSWY3DPEHPK3PXP7H6XZQYF5AAAAAAA"
            recoveryCodes={RECOVERY_CODES}
            onVerify={(code) => code === "123456" || "Code didn't match. (Try 123456.)"}
            onComplete={() => setShowMFA(false)}
          />
        ) : (
          <div className="text-center py-6">
            <Button onClick={() => setShowMFA(true)}>Start MFA setup</Button>
            <p className="text-xs text-white/50 mt-3">
              Verification code in this demo: <code className="font-mono">123456</code>
            </p>
          </div>
        )}
      </Demo>
    </Group>
  );
}
