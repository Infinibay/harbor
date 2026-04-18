import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Tabs, TabList, Tab, TabPanel } from "../../components";
import { SegmentedControl } from "../../components";
import { Breadcrumbs } from "../../components";
import { Pagination } from "../../components";
import { Stepper } from "../../components";
import { Button } from "../../components";

export function NavigationPage() {
  const [page, setPage] = useState(3);
  const [step, setStep] = useState(1);

  return (
    <Group id="navigation" title="Navigation" desc="Tabs, segments, breadcrumbs, pagination, stepper.">
      <Demo title="Tabs (pill)" wide intensity="soft">
        <Tabs defaultValue="overview" className="w-full">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="networks">Networks</Tab>
            <Tab value="storage">Storage</Tab>
            <Tab value="metrics">Metrics</Tab>
          </TabList>
          <TabPanel value="overview">
            <div className="text-sm text-white/65">Cluster overview — all green.</div>
          </TabPanel>
          <TabPanel value="networks">
            <div className="text-sm text-white/65">3 VPCs · 12 subnets · 0 misconfigurations.</div>
          </TabPanel>
          <TabPanel value="storage">
            <div className="text-sm text-white/65">8.2 TB used of 12 TB. 2 volumes at 95%.</div>
          </TabPanel>
          <TabPanel value="metrics">
            <div className="text-sm text-white/65">Live charts go here.</div>
          </TabPanel>
        </Tabs>
      </Demo>
      <Demo title="Tabs (underline)" wide intensity="soft">
        <Tabs variant="underline" defaultValue="a">
          <TabList>
            <Tab value="a">All</Tab>
            <Tab value="b">Running</Tab>
            <Tab value="c">Failed</Tab>
            <Tab value="d" disabled>
              Archived
            </Tab>
          </TabList>
        </Tabs>
      </Demo>
      <Demo title="Segmented control" intensity="soft">
        <SegmentedControl
          items={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
          defaultValue="week"
        />
      </Demo>
      <Demo title="Breadcrumbs" wide intensity="soft">
        <Breadcrumbs
          items={[
            { label: "infra" },
            { label: "production" },
            { label: "eu-west-1" },
            { label: "node-08" },
          ]}
        />
      </Demo>
      <Demo title="Pagination" wide intensity="soft">
        <Pagination page={page} total={12} onChange={setPage} />
      </Demo>
      <Demo title="Stepper (horizontal)" wide intensity="soft">
        <Col>
          <Stepper
            current={step}
            steps={[
              { label: "Account" },
              { label: "Workspace" },
              { label: "Team" },
              { label: "Deploy" },
            ]}
          />
          <Row>
            <Button size="sm" variant="ghost" onClick={() => setStep(Math.max(0, step - 1))}>
              Back
            </Button>
            <Button size="sm" onClick={() => setStep(Math.min(3, step + 1))}>
              Next
            </Button>
          </Row>
        </Col>
      </Demo>
      <Demo title="Stepper (vertical)" intensity="soft">
        <Stepper
          orientation="vertical"
          current={1}
          steps={[
            { label: "Connect git", description: "OAuth with GitHub or GitLab" },
            { label: "Pick a template", description: "Next.js, SvelteKit, etc." },
            { label: "Deploy" },
          ]}
        />
      </Demo>
    </Group>
  );
}
