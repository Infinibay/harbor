import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { ColorPicker } from "../../components";
import { MiniMap } from "../../components";
import { Inspector, PropertyRow, InspectorNumber } from "../../components";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "../../components";
import { ZoomControls } from "../../components";
import { Knob } from "../../components";
import { ToggleGroup } from "../../components";
import { IconButton } from "../../components";
import { TreeView } from "../../components";
import { FolderIcon, FileIcon } from "../../showcase/icons";

export function DesignPage() {
  const [pickerColor, setPickerColor] = useState("#a855f7");
  const [zoom, setZoom] = useState(125);
  const [viewport, setViewport] = useState({ x: 600, y: 400 });
  const [fill, setFill] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(80);
  const [blur, setBlur] = useState(0);
  const [tool, setTool] = useState("select");

  return (
    <Group id="design" title="Design tool" desc="Canvas, inspector, layers, color, transform.">
      <Demo title="Canvas toolbar" hint="Tool picker + zoom." wide>
        <Toolbar className="rounded-lg bg-white/[0.02] border border-white/10 px-1 py-1 w-full">
          <ToolbarGroup>
            <ToggleGroup
              size="sm"
              value={tool}
              onChange={(v) => setTool(v as string)}
              items={[
                { value: "select", label: "⬚" },
                { value: "pen", label: "✒" },
                { value: "text", label: "T" },
                { value: "rect", label: "▭" },
                { value: "circle", label: "◯" },
              ]}
            />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <IconButton size="sm" variant="ghost" label="Align left" icon="⬛" />
            <IconButton size="sm" variant="ghost" label="Align center" icon="⬜" />
            <IconButton size="sm" variant="ghost" label="Align right" icon="⬛" />
          </ToolbarGroup>
          <span className="flex-1" />
          <ToolbarGroup>
            <ZoomControls value={zoom} onChange={setZoom} />
          </ToolbarGroup>
        </Toolbar>
      </Demo>

      <Demo title="Layers panel">
        <div className="w-full">
          <TreeView
            defaultExpanded={["canvas", "hero"]}
            nodes={[
              {
                id: "canvas",
                label: "Canvas",
                icon: <FolderIcon />,
                children: [
                  {
                    id: "hero",
                    label: "Hero section",
                    icon: <FolderIcon />,
                    children: [
                      { id: "title", label: "Title", icon: <FileIcon /> },
                      { id: "subtitle", label: "Subtitle", icon: <FileIcon /> },
                      { id: "cta", label: "CTA Button", icon: <FileIcon /> },
                    ],
                  },
                  { id: "rect1", label: "Rectangle 1", icon: <FileIcon /> },
                  { id: "img1", label: "Image / photo", icon: <FileIcon /> },
                ],
              },
            ]}
          />
        </div>
      </Demo>

      <Demo title="Inspector">
        <Inspector
          className="w-full"
          sections={[
            {
              id: "transform",
              title: "Transform",
              children: (
                <>
                  <PropertyRow label="Fill">
                    <InspectorNumber value={fill} onChange={setFill} unit="%" min={0} max={100} />
                  </PropertyRow>
                  <PropertyRow label="Rotation">
                    <InspectorNumber value={rotation} onChange={setRotation} unit="°" min={-180} max={180} />
                  </PropertyRow>
                  <PropertyRow label="Opacity">
                    <InspectorNumber value={opacity} onChange={setOpacity} unit="%" min={0} max={100} />
                  </PropertyRow>
                </>
              ),
            },
            {
              id: "effects",
              title: "Effects",
              children: (
                <PropertyRow label="Blur">
                  <InspectorNumber value={blur} onChange={setBlur} unit="px" min={0} max={40} />
                </PropertyRow>
              ),
            },
            {
              id: "color",
              title: "Appearance",
              children: (
                <PropertyRow label="Fill">
                  <button
                    className="h-7 w-full rounded border border-white/10"
                    style={{ background: pickerColor }}
                  />
                </PropertyRow>
              ),
            },
          ]}
        />
      </Demo>

      <Demo title="Color picker">
        <ColorPicker value={pickerColor} onChange={setPickerColor} />
      </Demo>

      <Demo title="Canvas minimap" wide>
        <Col>
          <div className="text-xs text-white/50">
            Viewport at ({Math.round(viewport.x)}, {Math.round(viewport.y)}).
            Click/drag the minimap to navigate.
          </div>
          <MiniMap
            world={{ w: 2400, h: 1600 }}
            viewport={{ x: viewport.x, y: viewport.y, w: 600, h: 400 }}
            items={[
              { x: 100, y: 120, w: 400, h: 240, color: "rgba(168,85,247,0.4)" },
              { x: 900, y: 300, w: 500, h: 280, color: "rgba(56,189,248,0.4)" },
              { x: 1600, y: 900, w: 600, h: 300, color: "rgba(244,114,182,0.4)" },
              { x: 300, y: 1100, w: 300, h: 200, color: "rgba(52,211,153,0.4)" },
            ]}
            onNavigate={(x, y) => setViewport({ x, y })}
          />
        </Col>
      </Demo>

      <Demo title="Creative knobs" hint="Noise, distort, grain…">
        <Row attention>
          <Knob label="Grain" defaultValue={35} />
          <Knob label="Distort" defaultValue={12} />
          <Knob label="Glow" defaultValue={80} unit="%" />
        </Row>
      </Demo>
    </Group>
  );
}
