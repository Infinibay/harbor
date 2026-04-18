import { useState } from "react";
import { Group, Demo, Row } from "../../showcase/ShowcaseCard";
import { Button } from "../../components";
import { IconButton } from "../../components";
import { SplitButton } from "../../components";
import { CopyButton } from "../../components";
import { useToast } from "../../components";
import { Spark, Arrow, CopyIcon, GearIcon, TrashIcon } from "../../showcase/icons";

export function ButtonsPage() {
  const toast = useToast();
  return (
    <Group
      id="buttons"
      title="Buttons"
      desc="Squish, magnetic, ripple, loading. Todas las variantes."
    >
      <Demo title="Variants" hint="primary / secondary / ghost / destructive / glass">
        <Row attention>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="glass">Glass</Button>
        </Row>
      </Demo>
      <Demo title="Sizes" hint="Hover: los vecinos se atenúan.">
        <Row attention>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
      </Demo>
      <Demo title="Magnetic" hint="Sigue al cursor desde cerca.">
        <Button magnetic variant="primary" size="lg">
          Hover me
        </Button>
      </Demo>
      <Demo title="Loading">
        <LoadingButtonDemo />
      </Demo>
      <Demo title="With icons">
        <Row attention>
          <Button icon={<Arrow />} iconRight={<Spark />}>
            Deploy
          </Button>
          <Button variant="secondary" icon={<Arrow />}>
            Back
          </Button>
        </Row>
      </Demo>
      <Demo title="Icon buttons" hint="Acercá el cursor — se inclinan.">
        <Row attention>
          <IconButton label="Copy" icon={<CopyIcon />} />
          <IconButton label="Settings" icon={<GearIcon />} variant="ghost" />
          <IconButton label="Delete" icon={<TrashIcon />} variant="glass" />
          <IconButton label="Large" icon={<Spark />} size="lg" />
        </Row>
      </Demo>
      <Demo title="SplitButton" hint="Primary + related actions menu." wide>
        <SplitButton
          primary={{
            id: "deploy",
            label: "Deploy",
            icon: <Spark />,
            onSelect: () => toast.push({ title: "Deploying…", tone: "info" }),
          }}
          options={[
            {
              id: "preview",
              label: "Deploy preview",
              description: "Temporary URL for review",
              onSelect: () =>
                toast.push({ title: "Preview deploying", tone: "info" }),
            },
            {
              id: "rollback",
              label: "Rollback to previous",
              onSelect: () =>
                toast.push({ title: "Rolled back", tone: "success" }),
            },
            { id: "schedule", label: "Schedule deploy…", onSelect: () => {} },
          ]}
        />
      </Demo>
      <Demo title="CopyButton">
        <Row>
          <CopyButton value="sk-ab12-demo-token-000-111">Copy token</CopyButton>
          <CopyButton value="https://infini.bay/deploy/abc" size="sm" />
        </Row>
      </Demo>
    </Group>
  );
}

function LoadingButtonDemo() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      loading={busy}
      onClick={() => {
        setBusy(true);
        setTimeout(() => setBusy(false), 1800);
      }}
    >
      {busy ? "Deploying" : "Deploy"}
    </Button>
  );
}
