import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Badge } from "../../components";
import { Tag } from "../../components";
import { Avatar, AvatarStack } from "../../components";
import { Card, CardGrid } from "../../components";
import { Stat } from "../../components";
import { Progress } from "../../components";
import { ProgressRing } from "../../components";
import { Spinner, Dots } from "../../components";
import { Skeleton, SkeletonText } from "../../components";
import { Divider, Kbd } from "../../components";
import { HoverCard } from "../../components";
import { CountdownTimer } from "../../components";
import { EmptyState } from "../../components";
import { Button } from "../../components";
import { Spark } from "../../showcase/icons";
import { PricingTable } from "../../components";
import { ComparisonTable } from "../../components";
import { ArticleCard } from "../../components";
import { ProfileCard } from "../../components";
import { QuoteCard } from "../../components";
import { FeatureCard } from "../../components";
import { LinkPreviewCard } from "../../components";
import { NoteCard } from "../../components";
import { EventCard } from "../../components";

export function DisplayPage() {
  const [progress, setProgress] = useState(0);

  function runProgress() {
    setProgress(0);
    let v = 0;
    const t = setInterval(() => {
      v += Math.random() * 15 + 5;
      if (v >= 100) {
        v = 100;
        clearInterval(t);
      }
      setProgress(v);
    }, 250);
  }

  return (
    <Group id="display" title="Display" desc="Cards, stats, avatars, badges.">
      <Demo title="Cards interactivos" wide>
        <CardGrid cols={3} className="w-full">
          <Card interactive tilt title="CPU" description="Avg across cluster">
            <div className="text-3xl font-semibold text-white font-mono">68%</div>
          </Card>
          <Card interactive title="Requests / sec" description="Rolling 1m">
            <div className="text-3xl font-semibold text-white font-mono">12.4k</div>
          </Card>
          <Card interactive variant="glass" title="Latency p95" description="Edge → origin">
            <div className="text-3xl font-semibold text-white font-mono">84ms</div>
          </Card>
        </CardGrid>
      </Demo>
      <Demo title="Stats con count-up" wide>
        <CardGrid cols={3} className="w-full">
          <Stat label="Deploys" value={1247} change={12} />
          <Stat label="Users" value={38210} change={-3} />
          <Stat
            label="Revenue"
            value={91230}
            prefix="$"
            change={8}
            format={(n) => n.toLocaleString()}
          />
        </CardGrid>
      </Demo>
      <Demo title="Badges">
        <Row>
          <Badge>Neutral</Badge>
          <Badge tone="success" pulse>
            Live
          </Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Error</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="purple">Beta</Badge>
        </Row>
      </Demo>
      <Demo title="Tags">
        <Row>
          <Tag>default</Tag>
          <Tag onRemove={() => {}}>removable</Tag>
          <Tag icon={<Spark />}>with-icon</Tag>
        </Row>
      </Demo>
      <Demo title="Avatars">
        <Col>
          <Row>
            <Avatar name="Ana Fernández" status="online" />
            <Avatar name="Leo Park" status="busy" size="lg" />
            <Avatar name="Maya Singh" status="away" size="xl" interactive />
            <Avatar name="Ivan Kim" status="offline" />
          </Row>
          <AvatarStack
            people={[
              { name: "Ana F", status: "online" },
              { name: "Leo P", status: "online" },
              { name: "Maya S", status: "busy" },
              { name: "Ivan K" },
              { name: "Five Plus" },
              { name: "Six" },
              { name: "Seven" },
            ]}
          />
        </Col>
      </Demo>
      <Demo title="HoverCard" hint="Hover el link → preview.">
        <span className="text-sm text-white/75">
          Assigned to{" "}
          <HoverCard
            content={
              <Col>
                <Row>
                  <Avatar name="Ana Fernández" size="lg" status="online" />
                  <Col className="flex-1">
                    <span className="text-white font-medium">Ana Fernández</span>
                    <span className="text-xs text-white/50">Senior Platform · Madrid</span>
                  </Col>
                </Row>
                <Row>
                  <Button size="sm" variant="secondary">
                    Message
                  </Button>
                  <Button size="sm" variant="ghost">
                    View profile
                  </Button>
                </Row>
              </Col>
            }
          >
            <button className="text-fuchsia-300 underline underline-offset-2">@ana</button>
          </HoverCard>{" "}
          — latest activity 2h ago.
        </span>
      </Demo>
      <Demo title="Progress">
        <Col>
          <Progress value={72} label="Deployment" showValue shimmer />
          <Progress value={progress} tone="green" showValue />
          <Progress indeterminate tone="sky" label="Indeterminate" />
          <Button size="sm" variant="secondary" onClick={runProgress}>
            Run
          </Button>
        </Col>
      </Demo>
      <Demo title="Progress rings">
        <Row>
          <ProgressRing value={72} />
          <ProgressRing value={35} tone="amber" size={80} />
          <ProgressRing value={93} tone="green" size={72} />
          <ProgressRing value={18} tone="rose" size={64} />
        </Row>
      </Demo>
      <Demo title="Countdown">
        <CountdownTimer target={Date.now() + 3600000 * 13} />
      </Demo>
      <Demo title="Spinner & dots">
        <Row>
          <Spinner />
          <Spinner size={24} className="text-fuchsia-400" />
          <Dots className="text-white/70" />
        </Row>
      </Demo>
      <Demo title="Skeleton">
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton height={12} width="60%" />
              <div className="h-2" />
              <Skeleton height={10} width="40%" />
            </div>
          </div>
          <SkeletonText lines={3} />
        </div>
      </Demo>
      <Demo title="Divider & kbd">
        <Col>
          <Divider />
          <Divider>or continue with</Divider>
          <Row>
            <span className="text-xs text-white/60">Toggle palette:</span>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </Row>
        </Col>
      </Demo>
      <Demo title="PricingTable" wide>
        <PricingTable
          tiers={[
            {
              id: "hobby",
              name: "Hobby",
              price: 0,
              period: "mo",
              tagline: "For solo projects",
              cta: <Button variant="secondary" size="sm">Start free</Button>,
              features: [
                { label: "1 project", included: true },
                { label: "512 MB memory", included: true },
                { label: "Community support", included: true },
                { label: "Custom domains", included: false },
                { label: "SSO", included: false },
              ],
            },
            {
              id: "pro",
              name: "Pro",
              price: 24,
              period: "mo",
              tagline: "For growing teams",
              highlighted: true,
              badge: "Most popular",
              cta: <Button size="sm">Choose Pro</Button>,
              features: [
                { label: "Unlimited projects", included: true },
                { label: "8 GB memory", included: true },
                { label: "Priority support", included: true, hint: "< 4h response" },
                { label: "Custom domains", included: true },
                { label: "SSO", included: false },
              ],
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price: "Custom",
              tagline: "Scale & compliance",
              cta: <Button variant="secondary" size="sm">Contact us</Button>,
              features: [
                { label: "Everything in Pro", included: true },
                { label: "Dedicated nodes", included: true },
                { label: "SAML / SCIM SSO", included: true },
                { label: "Audit logs", included: true },
                { label: "99.99% uptime SLA", included: true },
              ],
            },
          ]}
        />
      </Demo>

      <Demo title="ComparisonTable" wide>
        <ComparisonTable
          plans={[
            { id: "hobby", name: "Hobby" },
            { id: "pro", name: "Pro", highlighted: true },
            { id: "ent", name: "Enterprise" },
          ]}
          groups={[
            {
              label: "Usage",
              rows: [
                { label: "Projects", values: ["1", "Unlimited", "Unlimited"] },
                { label: "Memory", values: ["512 MB", "8 GB", "Custom"] },
                { label: "Storage", values: ["1 GB", "100 GB", "Custom"] },
              ],
            },
            {
              label: "Collaboration",
              rows: [
                { label: "Team members", values: ["1", "10", "Unlimited"] },
                { label: "Audit logs", values: [false, false, true] },
                { label: "SSO (SAML)", values: [false, false, true] },
              ],
            },
            {
              label: "Support",
              rows: [
                { label: "Community", values: [true, true, true] },
                { label: "Priority support", values: [false, true, true], hint: "< 4h response" },
                { label: "Dedicated CSM", values: [false, false, true] },
              ],
            },
          ]}
        />
      </Demo>

      <Demo title="ArticleCard" hint="Cover + excerpt + meta." wide>
        <div className="grid md:grid-cols-2 gap-4 w-full">
          <ArticleCard
            cover="https://picsum.photos/seed/harbor1/800/450"
            title="Rebuilding Infinibay's Deploy Pipeline"
            excerpt="How we cut p95 build times from 4 minutes to 42 seconds by rethinking our layer caching and adopting parallel plan execution."
            author={{ name: "Ana Fernández" }}
            date="Apr 14"
            readTime="6 min read"
            tags={["engineering", "performance"]}
          />
          <ArticleCard
            cover="https://picsum.photos/seed/harbor2/800/450"
            title="A Quiet Update to the UI Toolkit"
            excerpt="New chart primitives, a cleaner overlay system, and a layer registry that stops z-index arms races for good."
            author={{ name: "Leo Park" }}
            date="Apr 10"
            readTime="3 min read"
            tags={["design"]}
          />
        </div>
      </Demo>

      <Demo title="ArticleCard (horizontal)" wide>
        <ArticleCard
          layout="horizontal"
          cover="https://picsum.photos/seed/harbor3/400/400"
          title="Why we rewrote our sidebar in a weekend"
          excerpt="A post-mortem on navigation, collapsible rails, and why you probably want a settings panel instead."
          author={{ name: "Maya Singh" }}
          date="Apr 18"
          readTime="4 min"
        />
      </Demo>

      <Demo title="ProfileCard" wide>
        <ProfileCard
          name="Ana Fernández"
          handle="ana"
          role="Senior Platform Engineer · Madrid"
          bio="Deploys at 3am so you don't have to. Probably drinking cortado."
          status="online"
          stats={[
            { label: "Deploys", value: "1.2k" },
            { label: "Reviews", value: "340" },
            { label: "Followers", value: "892" },
          ]}
          actions={
            <>
              <Button size="sm">Follow</Button>
              <Button size="sm" variant="secondary">
                Message
              </Button>
            </>
          }
        />
      </Demo>

      <Demo title="QuoteCard" hint="Pull quote / testimonials." wide>
        <QuoteCard
          quote="Harbor is the first UI library that felt designed for how real apps behave — not for a component zoo. Shipping was the easy part."
          author={{ name: "Leo Park", role: "CTO · Northwind" }}
        />
      </Demo>

      <Demo title="FeatureCard" hint="Para marketing / docs landing." wide>
        <div className="grid md:grid-cols-3 gap-3 w-full">
          <FeatureCard
            icon="⚡"
            accent="fuchsia"
            title="Instant deploys"
            description="Push to git and your service is live in under a minute — rollbacks are one click away."
            href="#"
          />
          <FeatureCard
            icon="🛡️"
            accent="sky"
            title="Audit everything"
            description="Every action is logged, searchable, and exportable. Built for teams that care about compliance."
            href="#"
          />
          <FeatureCard
            icon="🔌"
            accent="emerald"
            title="Connect anything"
            description="50+ integrations for databases, queues, storage, and observability out of the box."
            href="#"
          />
        </div>
      </Demo>

      <Demo title="LinkPreviewCard" hint="URL unfurl (Slack-style)." wide>
        <Col>
          <LinkPreviewCard
            url="https://infinibay.com/blog/deploying-faster"
            siteName="infinibay.com"
            title="Deploying 5x faster with layered caches"
            description="A deep dive into how we cut build times with content-addressed layer cache, shared across all environments."
            image="https://picsum.photos/seed/preview/400/220"
          />
          <LinkPreviewCard
            url="https://github.com/Infinibay/harbor"
            siteName="github.com"
            title="Infinibay/harbor — living UI component library"
            description="~120 components organized by intent. Cursor-reactive, coordinating, production-ready."
          />
        </Col>
      </Demo>

      <Demo title="NoteCard" hint="Ideas capturadas / sticky notes." wide>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <NoteCard color="yellow" title="Idea" date="today" tilt={-1}>
            Try spring physics for the gauge needle instead of easing.
          </NoteCard>
          <NoteCard color="pink" title="TODO" date="tomorrow" tilt={1.5}>
            Audit z-indexes one more pass before v1.0.
          </NoteCard>
          <NoteCard color="sky" title="Quote" author="— Dieter Rams">
            Good design is as little design as possible.
          </NoteCard>
          <NoteCard color="green" title="Found" date="Apr 12" tilt={-0.5}>
            `color-mix(in oklch, ...)` works in all evergreens now.
          </NoteCard>
        </div>
      </Demo>

      <Demo title="EventCard" wide>
        <div className="grid md:grid-cols-2 gap-3 w-full">
          <EventCard
            date={new Date()}
            title="Harbor v0.2 launch"
            time="10:00 AM CET"
            location="Online · Zoom"
            attendees={42}
            attending
            onToggleAttending={() => {}}
            description="Live walkthrough of the new sections, left panel variants, and content cards."
          />
          <EventCard
            date={new Date(Date.now() + 7 * 86400000)}
            title="Design review · Q2 roadmap"
            time="3:30 PM"
            location="Madrid office · Room 3"
            attendees={8}
            onToggleAttending={() => {}}
            description="Walk through what we're shipping next and pick up feedback before scoping."
          />
        </div>
      </Demo>

      <Demo title="EmptyState" wide>
        <EmptyState
          icon="🛰️"
          title="No deployments yet"
          description="Connect a repo to deploy your first service in seconds."
          actions={
            <>
              <Button size="sm">Connect repo</Button>
              <Button size="sm" variant="ghost">
                Learn more
              </Button>
            </>
          }
        />
      </Demo>
    </Group>
  );
}
