import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Sidebar } from "../../components";
import { Avatar } from "../../components";
import { Badge } from "../../components";
import { Button } from "../../components";
import { IconButton } from "../../components";
import { HomeIcon, FolderIcon, TrashIcon, Spark } from "../../showcase/icons";

type Mail = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  labels?: string[];
};

const mails: Mail[] = [
  { id: "m1", from: "Ana Fernández", subject: "Re: deploy schedule", preview: "Can we push this to Thursday? I want to double check…", time: "14:02", unread: true, labels: ["team"] },
  { id: "m2", from: "GitHub", subject: "[infinibay/ui] PR #142 ready for review", preview: "Leo Park opened a pull request…", time: "13:41", unread: true },
  { id: "m3", from: "Maya Singh", subject: "Design review notes", preview: "Here are my notes from today's session — mostly nits but…", time: "11:08", starred: true, labels: ["design"] },
  { id: "m4", from: "Linear", subject: "Weekly digest", preview: "3 completed · 8 in progress · 2 overdue", time: "09:30" },
  { id: "m5", from: "Ivan Kim", subject: "Lunch Friday?", preview: "Found a new ramen place near the office, thinking…", time: "Wed" },
  { id: "m6", from: "AWS", subject: "Your billing statement", preview: "Your March invoice is ready to view.", time: "Wed" },
];

export function EmailPage() {
  const [folder, setFolder] = useState("inbox");
  const [selected, setSelected] = useState("m1");
  const currentMail = mails.find((m) => m.id === selected) ?? mails[0];

  return (
    <Group id="email" title="Email client" desc="Three-pane layout — folders · list · preview.">
      <Demo title="Email layout" wide intensity="soft">
        <div className="w-full flex gap-3 h-[520px]">
          <div className="w-48 flex-none">
            <Sidebar
              selected={folder}
              onSelect={setFolder}
              header={
                <Row>
                  <Avatar name="Andrés" size="md" status="online" />
                  <div className="text-sm text-white font-semibold truncate">Mail</div>
                </Row>
              }
              sections={[
                {
                  items: [
                    { id: "inbox", label: "Inbox", icon: <HomeIcon />, badge: <Badge tone="purple">8</Badge> },
                    { id: "starred", label: "Starred", icon: <Spark /> },
                    { id: "sent", label: "Sent", icon: <FolderIcon /> },
                    { id: "drafts", label: "Drafts", icon: <FolderIcon /> },
                    { id: "trash", label: "Trash", icon: <TrashIcon /> },
                  ],
                },
                {
                  label: "Labels",
                  items: [
                    { id: "team", label: "team" },
                    { id: "design", label: "design" },
                    { id: "alerts", label: "alerts" },
                  ],
                },
              ]}
            />
          </div>

          <div className="w-80 flex-none rounded-2xl bg-white/[0.02] border border-white/8 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-white/5 text-xs text-white/45 uppercase tracking-[0.2em]">
              {folder}
            </div>
            <div className="flex-1 overflow-auto">
              {mails.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full text-left px-3 py-2.5 ${
                    selected === m.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                  } ${i > 0 ? "border-t border-white/5" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-sm truncate ${
                        m.unread ? "text-white font-semibold" : "text-white/80"
                      }`}
                    >
                      {m.from}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {m.time}
                    </span>
                  </div>
                  <div
                    className={`text-sm truncate ${
                      m.unread ? "text-white" : "text-white/70"
                    }`}
                  >
                    {m.subject}
                  </div>
                  <div className="text-xs text-white/45 truncate">
                    {m.preview}
                  </div>
                  {m.labels?.length ? (
                    <div className="mt-1 flex gap-1">
                      {m.labels.map((l) => (
                        <Badge key={l} tone="info">
                          {l}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0 rounded-2xl bg-white/[0.02] border border-white/8 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-start gap-3">
              <Avatar name={currentMail.from} size="md" />
              <Col className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {currentMail.subject}
                </div>
                <div className="text-xs text-white/55">
                  {currentMail.from} · {currentMail.time}
                </div>
              </Col>
              <Row>
                <IconButton size="sm" variant="ghost" label="Star" icon="⭐" />
                <IconButton size="sm" variant="ghost" label="Archive" icon="📦" />
                <IconButton size="sm" variant="ghost" label="Delete" icon={<TrashIcon />} />
              </Row>
            </div>
            <div className="flex-1 overflow-auto p-4 text-sm text-white/80 leading-relaxed">
              <p>Hi Andrés,</p>
              <p className="mt-3">{currentMail.preview}</p>
              <p className="mt-3">
                Let me know if this works and I can send over the updated plan
                with the new deploy windows.
              </p>
              <p className="mt-3 text-white/60">— {currentMail.from}</p>
            </div>
            <div className="p-3 border-t border-white/5">
              <Row>
                <Button variant="primary">Reply</Button>
                <Button variant="secondary">Forward</Button>
                <span className="flex-1" />
                <Button variant="ghost">Snooze</Button>
              </Row>
            </div>
          </div>
        </div>
      </Demo>
    </Group>
  );
}
