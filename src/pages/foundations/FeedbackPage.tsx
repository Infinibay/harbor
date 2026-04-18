import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Alert } from "../../components";
import { Button } from "../../components";
import { useToast } from "../../components";
import { Banner } from "../../components";
import { ErrorState } from "../../components";
import { ActivityFeed } from "../../components";
import { TickerTape } from "../../components";

export function FeedbackPage() {
  const toast = useToast();
  const [banner1, setBanner1] = useState(true);
  const [banner2, setBanner2] = useState(true);
  const [banner3, setBanner3] = useState(true);

  return (
    <Group id="feedback" title="Feedback" desc="Alerts, toasts, banners, activity, errors.">
      <Demo title="Banners" hint="Persistentes — para announcements y gates." wide intensity="soft">
        <div className="w-full flex flex-col gap-2">
          <Banner tone="promo" icon="✨" title="v2.3 is here" onClose={() => setBanner1(false)} open={banner1}>
            Async deploys, 40% faster cold starts, new audit log.
          </Banner>
          <Banner tone="warning" title="Scheduled maintenance" onClose={() => setBanner2(false)} open={banner2}>
            Read-only for 10 min this Sunday at 03:00 UTC.
          </Banner>
          <Banner tone="danger" title="Outage" onClose={() => setBanner3(false)} open={banner3} actions={<Button size="sm" variant="ghost">Status page</Button>}>
            eu-west-1 is degraded. We're investigating.
          </Banner>
          {!banner1 || !banner2 || !banner3 ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setBanner1(true);
                setBanner2(true);
                setBanner3(true);
              }}
            >
              Restore banners
            </Button>
          ) : null}
        </div>
      </Demo>

      <Demo title="TickerTape" hint="Scrolling horizontal loop." wide intensity="soft">
        <TickerTape
          items={[
            { id: "1", label: "BTC", value: "$64,210", change: 2.4 },
            { id: "2", label: "ETH", value: "$3,480", change: -1.2 },
            { id: "3", label: "AAPL", value: "$184.12", change: 0.8 },
            { id: "4", label: "GOOG", value: "$142.00", change: -0.3 },
            { id: "5", label: "TSLA", value: "$242.50", change: 3.1 },
            { id: "6", label: "MSFT", value: "$411.20", change: 0.4 },
          ]}
        />
      </Demo>

      <Demo title="ErrorState" wide intensity="soft">
        <ErrorState
          title="Couldn't load metrics"
          description="The metrics endpoint is unreachable. This may be a temporary issue."
          code="NETWORK_TIMEOUT · retry #3"
          onRetry={() => toast.push({ title: "Retrying…", tone: "info" })}
          actions={<Button size="sm" variant="ghost">Report</Button>}
        />
      </Demo>

      <Demo title="ActivityFeed" hint="Grouped by day." wide intensity="soft">
        <ActivityFeed
          events={[
            { id: "1", actor: "Ana", verb: "deployed", target: "api-gateway v2.3.0", time: new Date(), tone: "success", icon: "🚀" },
            { id: "2", actor: "Leo", verb: "opened", target: "PR #142", time: new Date(Date.now() - 2 * 3600 * 1000), tone: "info", icon: "📝" },
            { id: "3", actor: "Maya", verb: "resolved", target: "bug#89", description: "Race in token refresh", time: new Date(Date.now() - 26 * 3600 * 1000), tone: "success", icon: "✓" },
            { id: "4", actor: "System", verb: "rotated", target: "credentials", time: new Date(Date.now() - 28 * 3600 * 1000), tone: "warning", icon: "🔑" },
          ]}
        />
      </Demo>

      <Demo title="Alerts" wide intensity="soft">
        <Col>
          <Alert tone="info" title="Heads up">
            New secrets rotation policy takes effect next Monday.
          </Alert>
          <Alert tone="success" title="Deploy successful" onClose={() => {}}>
            api-gateway · v2.3.0 · 0 rollbacks.
          </Alert>
          <Alert
            tone="warning"
            title="High CPU"
            actions={
              <>
                <Button size="sm">Scale up</Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </>
            }
          >
            node-08 has been above 85% for 5 minutes.
          </Alert>
          <Alert tone="danger" title="Rollback required">
            Health checks failing on 3/5 replicas.
          </Alert>
        </Col>
      </Demo>
      <Demo title="Toasts" intensity="soft">
        <Row>
          <Button
            variant="secondary"
            onClick={() =>
              toast.push({
                tone: "success",
                title: "Deployed",
                description: "api-gateway v2.3.0 is live.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.push({
                tone: "warning",
                title: "High memory",
                description: "worker-pool above 90%.",
                action: { label: "Scale", onClick: () => {} },
              })
            }
          >
            With action
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              toast.push({
                tone: "danger",
                title: "Deploy failed",
                description: "Rolled back to v2.2.9.",
              })
            }
          >
            Error
          </Button>
        </Row>
      </Demo>
    </Group>
  );
}
