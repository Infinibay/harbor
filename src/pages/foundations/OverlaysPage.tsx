import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Tooltip } from "../../components";
import { Popover } from "../../components";
import { Dialog } from "../../components";
import { Drawer } from "../../components";
import { Menu, MenuItem, MenuSeparator, MenuLabel } from "../../components";
import { ContextMenu } from "../../components";
import { CommandPalette } from "../../components";
import { Button } from "../../components";
import { TextField } from "../../components";
import { Stat } from "../../components";
import { SkeletonText } from "../../components";
import { Kbd } from "../../components";
import { useToast } from "../../components";
import { Spark, Arrow, CopyIcon, GearIcon, TrashIcon } from "../../showcase/icons";

export function OverlaysPage() {
  const toast = useToast();
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [cmd, setCmd] = useState(false);

  return (
    <Group id="overlays" title="Overlays" desc="Tooltip, popover, dialog, menus.">
      <Demo title="Tooltip">
        <Row>
          <Tooltip content="Top tooltip">
            <Button variant="secondary">Top</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" side="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
          <Tooltip content="Bottom" side="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left" side="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
        </Row>
      </Demo>
      <Demo title="Popover">
        <Popover
          content={
            <div className="w-56">
              <div className="text-sm text-white font-semibold">Quick actions</div>
              <div className="text-xs text-white/55 mt-1 mb-3">Do more with less clicks.</div>
              <Row>
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="ghost">
                  Later
                </Button>
              </Row>
            </div>
          }
        >
          <Button variant="secondary">Open popover</Button>
        </Popover>
      </Demo>
      <Demo title="Dialog">
        <Row>
          <Button onClick={() => setDialog(true)}>Open dialog</Button>
          <Dialog
            open={dialog}
            onClose={() => setDialog(false)}
            title="Delete workspace?"
            description="This action cannot be undone. All projects, deployments and secrets will be permanently removed."
            footer={
              <>
                <Button variant="ghost" onClick={() => setDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setDialog(false)}>
                  Delete forever
                </Button>
              </>
            }
          >
            <TextField label="Type ‘DELETE’ to confirm" placeholder="DELETE" />
          </Dialog>
        </Row>
      </Demo>
      <Demo title="Drawer">
        <Button onClick={() => setDrawer(true)} variant="secondary">
          Open drawer
        </Button>
        <Drawer
          open={drawer}
          onClose={() => setDrawer(false)}
          title="Deployment details"
          footer={
            <Row className="justify-end">
              <Button variant="ghost" onClick={() => setDrawer(false)}>
                Close
              </Button>
              <Button>Retry</Button>
            </Row>
          }
        >
          <Col>
            <Stat label="Requests" value={12400} change={8} />
            <SkeletonText lines={4} />
          </Col>
        </Drawer>
      </Demo>
      <Demo title="Menu con submenús">
        <Menu trigger={<Button variant="secondary">Actions ⌄</Button>}>
          <MenuLabel>Deploy</MenuLabel>
          <MenuItem icon={<Spark />} shortcut="⌘D">
            Deploy latest
          </MenuItem>
          <MenuItem icon={<Arrow />}>Rollback</MenuItem>
          <MenuItem
            icon={<GearIcon />}
            submenu={
              <>
                <MenuItem>Read-only</MenuItem>
                <MenuItem>Contributor</MenuItem>
                <MenuItem>Admin</MenuItem>
                <MenuSeparator />
                <MenuItem
                  submenu={
                    <>
                      <MenuItem>Workspace</MenuItem>
                      <MenuItem>Project</MenuItem>
                      <MenuItem>Service</MenuItem>
                    </>
                  }
                >
                  Scope
                </MenuItem>
              </>
            }
          >
            Permissions
          </MenuItem>
          <MenuSeparator />
          <MenuItem danger icon={<TrashIcon />} shortcut="⌫">
            Delete
          </MenuItem>
        </Menu>
      </Demo>
      <Demo title="Context menu" hint="Right-click sobre la card.">
        <ContextMenu
          className="w-full"
          menu={
            <>
              <MenuItem icon={<CopyIcon />} shortcut="⌘C">
                Copy
              </MenuItem>
              <MenuItem icon={<Arrow />}>Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem danger icon={<TrashIcon />}>
                Delete
              </MenuItem>
            </>
          }
        >
          <div className="w-full h-24 rounded-xl bg-white/5 border border-dashed border-white/15 grid place-items-center text-white/55 text-sm">
            Right-click here
          </div>
        </ContextMenu>
      </Demo>
      <Demo title="Command palette">
        <Button onClick={() => setCmd(true)}>
          Open <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Button>
        <CommandPalette
          open={cmd}
          onOpenChange={setCmd}
          commands={[
            {
              id: "1",
              label: "Deploy latest build",
              section: "Deploy",
              shortcut: "⌘D",
              icon: <Spark />,
              action: () => toast.push({ title: "Deploying…" }),
            },
            { id: "2", label: "Rollback", section: "Deploy", icon: <Arrow />, action: () => {} },
            { id: "3", label: "Invite user", section: "Team", action: () => {} },
            { id: "4", label: "Open settings", section: "App", shortcut: "⌘,", icon: <GearIcon />, action: () => {} },
            { id: "5", label: "Rotate credentials", section: "Security", action: () => {} },
          ]}
        />
      </Demo>
    </Group>
  );
}
