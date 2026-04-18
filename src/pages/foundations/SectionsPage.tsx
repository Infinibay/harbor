import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import {
  Prose,
  Section,
  HeroSection,
  SplitSection,
  Aside,
  TOC,
  Button,
} from "../../components";

export function SectionsPage() {
  return (
    <Group
      id="sections"
      title="Sections · reading layouts"
      desc="Semantic, typographic building blocks — Prose, Section, Hero, Aside, TOC."
    >
      <Demo title="Prose — readable long-form" hint="Constrained line-length, nice typography." calm wide>
        <Prose>
          <h1>Deploying 5x faster with layered caches</h1>
          <p>
            When we started Infinibay, our builds took <strong>4 minutes on a
            good day</strong> and could spike to 12. We assumed that was the
            cost of doing business. It wasn&apos;t — it was a caching problem
            in a trenchcoat.
          </p>
          <h2>The diagnosis</h2>
          <p>
            Every deploy was re-uploading dependencies that hadn&apos;t moved
            since the last push. We were paying for{" "}
            <a href="#">content-addressable hashing</a> but throwing the
            results away by keying on commit SHAs instead of file contents.
          </p>
          <h3>The fix</h3>
          <ul>
            <li>Switch cache key from commit to content hash.</li>
            <li>Warm layers from the nearest peer, not origin.</li>
            <li>Skip layers that didn&apos;t change between builds.</li>
          </ul>
          <blockquote>
            You will always be fastest when you do less work. The trick is
            noticing how much you were doing.
          </blockquote>
          <p>
            After the rollout, p95 build times dropped to <code>42s</code>.
            The p99 improvement was more dramatic.
          </p>
        </Prose>
      </Demo>

      <Demo title="Section — titled content block" wide calm>
        <Section
          kicker="Docs"
          title="Get up and running in minutes"
          description="Infinibay is a managed platform; there's nothing to install on your servers. Point a repo, pick a region, press deploy."
          actions={
            <>
              <Button>Start</Button>
              <Button variant="secondary">Read docs</Button>
            </>
          }
          spacing="compact"
        >
          <div className="grid md:grid-cols-3 gap-3">
            {["Fast", "Safe", "Observable"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75"
              >
                <div className="text-white font-medium mb-1">{label}</div>
                Body copy explaining this column briefly.
              </div>
            ))}
          </div>
        </Section>
      </Demo>

      <Demo title="Section — centered" wide calm>
        <Section
          kicker="Changelog"
          title="What shipped in v0.2"
          description="Charts, collab, virtualized lists, reading cards, and a sidebar overhaul."
          align="center"
          spacing="compact"
        />
      </Demo>

      <Demo title="HeroSection — split" wide calm>
        <HeroSection
          eyebrow="v0.2 · live now"
          title="The UI library that"
          highlight="feels alive."
          description="Harbor is ~120 components built around cursor reactivity, coordination, and production-ready patterns. Drop it in and ship."
          primaryCta={<Button size="lg">Get started</Button>}
          secondaryCta={<Button size="lg" variant="secondary">See components</Button>}
          layout="split"
          media={
            <div
              className="aspect-[4/3] rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg,#a855f7 0%,#38bdf8 50%,#f472b6 100%)",
              }}
            />
          }
        />
      </Demo>

      <Demo title="SplitSection — alternating features" wide calm>
        <Col>
          <SplitSection
            kicker="Feature · 1"
            title="Deploys that don't flinch"
            description="Every deploy goes through safety gates — health checks, canary windows, automatic rollback. If it doesn't look healthy, it never becomes production."
            media={
              <div
                className="aspect-video rounded-xl"
                style={{ background: "linear-gradient(135deg,#38bdf8,#a855f7)" }}
              />
            }
          >
            <Button>Try it</Button>
          </SplitSection>
          <SplitSection
            reverse
            kicker="Feature · 2"
            title="Observability, not just logs"
            description="Metrics, traces, and events in the same view. Ask a question about a request and get to the answer without switching tools."
            media={
              <div
                className="aspect-video rounded-xl"
                style={{ background: "linear-gradient(135deg,#f472b6,#34d399)" }}
              />
            }
          />
        </Col>
      </Demo>

      <Demo title="Aside — inline callouts" wide calm>
        <Prose>
          <p>
            Harbor supports five kinds of inline callouts for highlighting
            notes, tips, and warnings inside your prose content:
          </p>
          <Aside tone="note">
            This is a plain note — context that&apos;s helpful but not critical.
          </Aside>
          <Aside tone="tip">
            <strong>Tip:</strong> Use Prose as the parent when rendering
            markdown — it takes care of spacing and typography.
          </Aside>
          <Aside tone="info">
            The layer system lives in <code>src/lib/z.ts</code>. Import
            constants from there instead of hard-coding z-indexes.
          </Aside>
          <Aside tone="warning">
            Don&apos;t animate <code>backdrop-filter</code> on a parent that
            itself animates opacity — the compositing layer breaks blur.
          </Aside>
          <Aside tone="danger">
            Do not commit <code>.env</code> files. Harbor&apos;s .gitignore
            excludes them, but check before you push.
          </Aside>
        </Prose>
      </Demo>

      <Demo title="TOC — table of contents with scroll-spy" wide calm>
        <div className="grid md:grid-cols-[200px_1fr] gap-8 w-full">
          <TOC
            items={[
              { id: "toc-install", label: "Install" },
              { id: "toc-config", label: "Configure", level: 2 },
              { id: "toc-deploy", label: "Deploy" },
              { id: "toc-monitor", label: "Monitor", level: 2 },
              { id: "toc-scale", label: "Scale" },
            ]}
          />
          <Prose>
            <h2 id="toc-install">Install</h2>
            <p>One CLI, one login. Everything else is in your browser.</p>
            <h3 id="toc-config">Configure</h3>
            <p>
              Point at your repo and pick a region. Infinibay handles the
              rest — no YAML gymnastics.
            </p>
            <h2 id="toc-deploy">Deploy</h2>
            <p>Push to main and a deploy runs automatically.</p>
            <h3 id="toc-monitor">Monitor</h3>
            <p>Metrics and logs live in the same place.</p>
            <h2 id="toc-scale">Scale</h2>
            <p>Autoscaling responds to live traffic in seconds.</p>
          </Prose>
        </div>
      </Demo>
    </Group>
  );
}
