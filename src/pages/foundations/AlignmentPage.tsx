import { useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import {
  ActionRow,
  Button,
  FieldRow,
  FieldSpacer,
  FormField,
  LabelLane,
  Select,
  TextField,
  Textarea,
} from "../../components";

export function AlignmentPage() {
  const [first, setFirst] = useState("Ada");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("ada@lovelace.dev");
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [name, setName] = useState("production");
  const [note, setNote] = useState("");
  const [desc, setDesc] = useState("");
  const [shortLabel, setShortLabel] = useState("");
  const [midLabel, setMidLabel] = useState("");
  const [longLabel, setLongLabel] = useState("");

  const regionOpts = [
    { value: "us-east-1", label: "US East (Virginia)" },
    { value: "us-west-2", label: "US West (Oregon)" },
    { value: "eu-west-1", label: "EU West (Ireland)" },
  ];

  return (
    <Group
      id="alignment"
      title="Alignment · form grids"
      desc="Label / control / message baselines that snap across columns — no invisible placeholders, no &nbsp; hacks."
    >
      <Demo
        title="FieldRow — the broken flex row"
        hint="Plain flex-row. The Search button drifts up to the label baseline."
        intensity="soft"
      >
        <div className="flex gap-4 w-full">
          <FormField label="First name">
            <TextField
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </FormField>
          <FormField label="Last name">
            <TextField
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </FormField>
          <Button>Search</Button>
        </div>
      </Demo>

      <Demo
        title="FieldRow — fixed"
        hint="FieldRow.Action slots the button into the control row."
        intensity="soft"
      >
        <FieldRow template="1fr 1fr auto">
          <FormField label="First name">
            <TextField
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </FormField>
          <FormField label="Last name">
            <TextField
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </FormField>
          <FieldRow.Action>
            <Button>Search</Button>
          </FieldRow.Action>
        </FieldRow>
      </Demo>

      <Demo
        title="FieldRow — error doesn't shift siblings"
        hint="Try typing an invalid email. The error reserves row 3 so nothing jumps."
        intensity="soft"
        wide
      >
        <FieldRow template="1fr 1fr">
          <FormField label="Workspace name" helper="Public in URLs.">
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormField
            label="Contact email"
            error={
              email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? "Not a valid address"
                : undefined
            }
          >
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
        </FieldRow>
      </Demo>

      <Demo
        title="FieldRow — mixed control heights"
        hint="Textarea next to TextField. controlAlign=start keeps labels aligned at the top."
        intensity="soft"
        wide
      >
        <FieldRow template="1fr 2fr" controlAlign="start">
          <FormField label="Region">
            <Select
              value={region}
              onChange={setRegion}
              options={regionOpts}
            />
          </FormField>
          <FormField label="Deployment notes" helper="Shown in the audit log.">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </FormField>
        </FieldRow>
      </Demo>

      <Demo
        title="FieldSpacer — dead cell in a grid"
        hint="3-column grid where the middle slot has no field — spacer keeps the next row aligned."
        intensity="soft"
        wide
      >
        <FieldRow template="1fr 1fr 1fr">
          <FormField label="Street"><TextField /></FormField>
          <FormField label="Apt / suite (optional)"><TextField /></FormField>
          <FormField label="ZIP"><TextField /></FormField>

          <FormField label="City"><TextField /></FormField>
          <FieldSpacer />
          <FormField label="Country">
            <Select
              value="us"
              onChange={() => {}}
              options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
              ]}
            />
          </FormField>
        </FieldRow>
      </Demo>

      <Demo
        title="FieldRow.Slot — search bar"
        hint="Input fills the row, button slots into the same control line."
        intensity="soft"
      >
        <FieldRow template="1fr auto" reserveMessage={false}>
          <FormField labelless>
            <TextField
              placeholder="Search workspaces, deployments, users…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </FormField>
          <FieldRow.Action>
            <Button variant="secondary">Search</Button>
          </FieldRow.Action>
        </FieldRow>
      </Demo>

      <Demo
        title="LabelLane — short labels"
        hint="Short label widths share a column — controls all start at the same X."
        intensity="soft"
      >
        <LabelLane>
          <FormField label="Name">
            <TextField
              value={shortLabel}
              onChange={(e) => setShortLabel(e.target.value)}
            />
          </FormField>
          <FormField label="Email address">
            <TextField
              value={midLabel}
              onChange={(e) => setMidLabel(e.target.value)}
            />
          </FormField>
          <FormField label="Phone">
            <TextField
              value={longLabel}
              onChange={(e) => setLongLabel(e.target.value)}
            />
          </FormField>
        </LabelLane>
      </Demo>

      <Demo
        title="LabelLane — with a long label"
        hint="One long label pushes the shared column wider. Try it."
        intensity="soft"
      >
        <LabelLane labelMax="18rem">
          <FormField label="Name" required>
            <TextField defaultValue="Marie" />
          </FormField>
          <FormField
            label="Emergency contact email"
            helper="Used only for account recovery."
          >
            <TextField defaultValue="backup@lovelace.dev" />
          </FormField>
          <FormField label="Role">
            <Select
              value="admin"
              onChange={() => {}}
              options={[
                { value: "admin", label: "Admin" },
                { value: "member", label: "Member" },
              ]}
            />
          </FormField>
        </LabelLane>
      </Demo>

      <Demo
        title="ActionRow — end-aligned"
        hint="Standard OK / Cancel footer."
        intensity="soft"
      >
        <Col>
          <FormField label="Description">
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
            />
          </FormField>
          <ActionRow align="end" divide>
            <Button variant="ghost">Cancel</Button>
            <Button>Save changes</Button>
          </ActionRow>
        </Col>
      </Demo>

      <Demo
        title="ActionRow — destructive split"
        hint="align=between pushes the first child to the far left."
        intensity="soft"
      >
        <ActionRow align="between" divide>
          <Button variant="destructive">Delete workspace</Button>
          <div className="flex gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </div>
        </ActionRow>
      </Demo>

      <Demo
        title="ActionRow — stacked on mobile"
        hint="stackBelow=sm: full-width buttons below 640px, primary on top."
        intensity="soft"
      >
        <ActionRow align="end" stackBelow="sm">
          <Button variant="ghost">Back</Button>
          <Button variant="secondary">Save draft</Button>
          <Button>Publish</Button>
        </ActionRow>
      </Demo>
    </Group>
  );
}
