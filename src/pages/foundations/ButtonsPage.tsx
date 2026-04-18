import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Button } from "../../components";
import { IconButton } from "../../components";
import { SplitButton } from "../../components";
import { CopyButton } from "../../components";
import { ButtonGroup } from "../../components";
import { ToggleButton } from "../../components";
import { FAB } from "../../components";
import { SpeedDial } from "../../components";
import { SocialButton } from "../../components";
import { MoreButton } from "../../components";
import { CloseButton } from "../../components";
import { useToast } from "../../components";
import { Spark, Arrow, CopyIcon, GearIcon, TrashIcon } from "../../showcase/icons";

export function ButtonsPage() {
  const toast = useToast();
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
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

      <Demo title="ButtonGroup" hint="Segmentado — bordes compartidos." wide>
        <Col>
          <ButtonGroup>
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
            <Button variant="secondary">Year</Button>
          </ButtonGroup>
          <ButtonGroup attached={false}>
            <Button size="sm" icon={<Arrow />}>Prev</Button>
            <Button size="sm" variant="secondary">Today</Button>
            <Button size="sm" iconRight={<Arrow />} variant="secondary">Next</Button>
          </ButtonGroup>
        </Col>
      </Demo>

      <Demo title="ToggleButton" hint="Mantiene estado pressed.">
        <Row attention>
          <ToggleButton pressed={bold} onChange={setBold} icon="B" />
          <ToggleButton pressed={italic} onChange={setItalic} icon={<span className="italic">I</span>} />
          <ToggleButton pressed={underline} onChange={setUnderline} icon={<span className="underline">U</span>} />
          <ToggleButton pressed={false} onChange={() => {}} icon={<Spark />}>
            Star
          </ToggleButton>
        </Row>
      </Demo>

      <Demo title="FAB — Floating Action Button" hint="Circular, posiciona fixed o inline." wide>
        <Row className="gap-8 items-center">
          <FAB position="none" icon="＋" label="New" onClick={() => toast.push({ title: "New item", tone: "info" })} />
          <FAB position="none" size="lg" variant="secondary" icon={<Spark />} label="Deploy" />
          <FAB
            position="none"
            variant="secondary"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5v14" />
              </svg>
            }
            label="Add"
          />
        </Row>
      </Demo>

      <Demo title="SpeedDial" hint="FAB que expande sub-acciones al hover." wide>
        <div className="w-full h-[220px] flex items-end justify-end bg-white/[0.02] rounded-xl border border-white/8 p-4 relative">
          <SpeedDial
            position="none"
            direction="up"
            icon="＋"
            actions={[
              { id: "a", label: "New project", icon: "📁", onSelect: () => toast.push({ title: "Project", tone: "info" }) },
              { id: "b", label: "Invite user", icon: "👤", onSelect: () => toast.push({ title: "Invite", tone: "info" }) },
              { id: "c", label: "Deploy", icon: <Spark />, onSelect: () => toast.push({ title: "Deploy", tone: "info" }) },
            ]}
          />
        </div>
      </Demo>

      <Demo title="SocialButton" hint="OAuth providers con brand colors." wide>
        <Col>
          <SocialButton provider="github" fullWidth />
          <SocialButton provider="google" fullWidth />
          <Row>
            <SocialButton provider="apple" />
            <SocialButton provider="microsoft" />
            <SocialButton provider="x" />
          </Row>
          <Row>
            <SocialButton provider="gitlab" />
            <SocialButton provider="discord" />
            <SocialButton provider="slack" />
          </Row>
        </Col>
      </Demo>

      <Demo title="MoreButton & CloseButton" hint="Triggers y dismiss estandarizados.">
        <Row>
          <MoreButton />
          <MoreButton orientation="horizontal" />
          <MoreButton size="sm" />
          <span className="w-4" />
          <CloseButton />
          <CloseButton variant="solid" />
          <CloseButton size="sm" />
          <CloseButton size="lg" />
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
