import { useState } from "react";
import { PermissionMatrix, type PermissionCell } from "./PermissionMatrix";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const samplePrincipals = [
  { id: "u1", label: "Ada Lovelace", kind: "admin", avatar: "AL" },
  { id: "u2", label: "Linus T.", kind: "user", avatar: "LT" },
  { id: "u3", label: "Grace H.", kind: "user", avatar: "GH" },
  { id: "r1", label: "Ops role", kind: "role" },
];

const sampleResources = [
  { id: "vm.create", label: "create", group: "vm" },
  { id: "vm.delete", label: "delete", group: "vm" },
  { id: "vm.snapshot", label: "snapshot", group: "vm" },
  { id: "billing.view", label: "view", group: "billing" },
  { id: "billing.edit", label: "edit", group: "billing" },
  { id: "audit.read", label: "read", group: "audit" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PermissionMatrixDemo(props: any) {
  const [value, setValue] = useState<Record<string, PermissionCell>>({
    "u1:vm.create": "allow",
    "u1:vm.delete": "allow",
    "u1:vm.snapshot": "allow",
    "u1:billing.view": "allow",
    "u2:vm.create": "allow",
    "u2:billing.edit": "deny",
    "u3:audit.read": "allow",
    "r1:vm.create": "allow",
    "r1:vm.snapshot": "allow",
  });

  return (
    <div style={{ width: "100%", maxHeight: 480 }}>
      <PermissionMatrix
        principals={samplePrincipals}
        resources={sampleResources}
        value={value}
        density={props.density ?? "expanded"}
        onChange={(p, r, next) =>
          setValue((cur) => ({ ...cur, [`${p}:${r}`]: next }))
        }
        onBulkChange={(changes) =>
          setValue((cur) => {
            const next = { ...cur };
            for (const c of changes) next[`${c.principalId}:${c.resourceId}`] = c.value;
            return next;
          })
        }
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: PermissionMatrixDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    density: { type: "select", options: ["compact", "expanded"], default: "expanded" },
  },
  variants: [
    { label: "Expanded", props: { density: "expanded" } },
    { label: "Compact", props: { density: "compact" } },
  ],
  events: [
    { name: "onChange", signature: "(principalId, resourceId, next: PermissionCell) => void" },
    { name: "onBulkChange", signature: "(changes: { principalId, resourceId, value }[]) => void" },
  ],
};
