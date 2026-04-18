import { useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { TextField } from "../../components";
import { Textarea } from "../../components";
import { Checkbox } from "../../components";
import { RadioGroup, Radio } from "../../components";
import { Switch } from "../../components";
import { Slider } from "../../components";
import { Select } from "../../components";
import { NumberField } from "../../components";
import { SearchField } from "../../components";
import { Combobox } from "../../components";
import { TagInput } from "../../components";
import { FileDrop } from "../../components";
import { ColorSwatch } from "../../components";
import { MultiSelect } from "../../components";
import { DatePicker } from "../../components";
import { Calendar } from "../../components";
import { InlineEdit } from "../../components";
import { OTPInput } from "../../components";
import { Rating } from "../../components";
import { RangeSlider } from "../../components";
import { ToggleGroup } from "../../components";
import { Wizard } from "../../components";

export function InputsPage() {
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [radio, setRadio] = useState("b");
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [slide, setSlide] = useState(42);
  const [num, setNum] = useState(4);
  const [sel, setSel] = useState("prod");
  const [combo, setCombo] = useState("alpha");
  const [tags, setTags] = useState(["docker", "kubernetes", "nix"]);
  const [color, setColor] = useState("#a855f7");
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [multi, setMulti] = useState<string[]>(["a", "c"]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [inlineName, setInlineName] = useState("production-cluster");
  const [otp, setOtp] = useState("");
  const [rating, setRating] = useState(4);
  const [range, setRange] = useState<[number, number]>([24, 76]);
  const [toggleView, setToggleView] = useState("grid");
  const [toggleMulti, setToggleMulti] = useState<string[]>(["b"]);

  return (
    <Group id="inputs" title="Inputs & Forms" desc="Basics and advanced.">
      <Demo title="TextField" hint="Floating label, live validation.">
        <Col>
          <TextField label="Workspace name" placeholder="my-company" hint="Public in URLs" />
          <TextField
            label="Email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            valid={emailValid}
            error={email && !emailValid ? "Enter a valid email" : undefined}
          />
        </Col>
      </Demo>
      <Demo title="Textarea" hint="Counter con progress.">
        <Textarea label="Description" placeholder="Tell us about this deployment…" maxChars={120} />
      </Demo>
      <Demo title="InlineEdit" hint="Click text → input in place.">
        <Col>
          <span className="text-xs text-white/55">Cluster name</span>
          <InlineEdit value={inlineName} onChange={setInlineName} as="heading" />
          <span className="text-xs text-white/40">Press Enter to save, Esc to cancel.</span>
        </Col>
      </Demo>
      <Demo title="OTP input" hint="Paste a code — it fills.">
        <Col>
          <OTPInput value={otp} onChange={setOtp} />
          <span className="text-xs text-white/50">
            {otp.length === 6 ? "✓ ready to submit" : `${otp.length}/6`}
          </span>
        </Col>
      </Demo>
      <Demo title="Checkbox">
        <Col>
          <Checkbox
            label="Enable auto-scaling"
            description="Adjust replicas based on CPU load."
            checked={check1}
            onChange={(e) => setCheck1(e.target.checked)}
          />
          <Checkbox
            label="Notify on failures"
            checked={check2}
            onChange={(e) => setCheck2(e.target.checked)}
          />
        </Col>
      </Demo>
      <Demo title="Radio group">
        <RadioGroup value={radio} onChange={setRadio}>
          <Radio value="a" label="Hobby" description="1 project, 512 MB" />
          <Radio value="b" label="Pro" description="Unlimited, 8 GB" />
          <Radio value="c" label="Enterprise" description="SSO, audit logs" />
        </RadioGroup>
      </Demo>
      <Demo title="Switch">
        <Col>
          <Switch
            label="Dark mode"
            description="Use the force."
            checked={sw1}
            onChange={(e) => setSw1(e.target.checked)}
          />
          <Switch
            label="Beta features"
            checked={sw2}
            onChange={(e) => setSw2(e.target.checked)}
          />
        </Col>
      </Demo>
      <Demo title="Slider" hint="Tooltip live mientras arrastrás.">
        <Slider label="CPU limit" value={slide} onChange={setSlide} snap={[0, 25, 50, 75, 100]} />
      </Demo>
      <Demo title="RangeSlider" hint="Dos thumbs, dragable.">
        <RangeSlider label="Price range" value={range} onChange={setRange} />
      </Demo>
      <Demo title="NumberField" hint="Los dígitos animan up/down.">
        <NumberField label="Replicas" value={num} onChange={setNum} min={1} max={20} />
      </Demo>
      <Demo title="Rating">
        <Col>
          <Rating value={rating} onChange={setRating} />
          <span className="text-xs text-white/50 font-mono">{rating} / 5</span>
        </Col>
      </Demo>
      <Demo title="ToggleGroup" hint="Single y multiple.">
        <Col>
          <ToggleGroup
            value={toggleView}
            onChange={(v) => setToggleView(v as string)}
            items={[
              { value: "grid", label: "Grid" },
              { value: "list", label: "List" },
              { value: "split", label: "Split" },
            ]}
          />
          <ToggleGroup
            multiple
            value={toggleMulti}
            onChange={(v) => setToggleMulti(v as string[])}
            items={[
              { value: "a", label: "Bold" },
              { value: "b", label: "Italic" },
              { value: "c", label: "Underline" },
            ]}
          />
        </Col>
      </Demo>
      <Demo title="Select">
        <Select
          label="Environment"
          value={sel}
          onChange={setSel}
          options={[
            { value: "dev", label: "Development" },
            { value: "staging", label: "Staging" },
            { value: "prod", label: "Production", description: "⚠ live traffic" },
          ]}
        />
      </Demo>
      <Demo title="MultiSelect" hint="Tags dentro del trigger.">
        <MultiSelect
          label="Team members"
          value={multi}
          onChange={setMulti}
          options={[
            { value: "a", label: "Ana Fernández" },
            { value: "b", label: "Leo Park" },
            { value: "c", label: "Maya Singh" },
            { value: "d", label: "Ivan Kim" },
          ]}
        />
      </Demo>
      <Demo title="Combobox" hint="Select + búsqueda.">
        <Combobox
          label="Region"
          value={combo}
          onChange={setCombo}
          options={[
            { value: "alpha", label: "eu-west-1 · Ireland" },
            { value: "beta", label: "us-east-1 · N. Virginia" },
            { value: "gamma", label: "ap-south-1 · Mumbai" },
            { value: "delta", label: "sa-east-1 · São Paulo" },
          ]}
        />
      </Demo>
      <Demo title="Search" hint="Debounced, highlight match.">
        <SearchField
          placeholder="Search services…"
          onSearch={async (q) => {
            const all = ["api-gateway", "auth-service", "worker-pool", "billing", "notifier", "ingester"];
            return all
              .filter((a) => a.includes(q.toLowerCase()))
              .map((a) => ({ id: a, title: a, subtitle: "production" }));
          }}
        />
      </Demo>
      <Demo title="DatePicker">
        <DatePicker value={date} onChange={setDate} label="Date" />
      </Demo>
      <Demo title="Calendar inline">
        <Calendar value={date} onChange={setDate} />
      </Demo>
      <Demo title="Tag input">
        <TagInput label="Labels" value={tags} onChange={setTags} placeholder="Enter to add" />
      </Demo>
      <Demo title="File drop" wide>
        <FileDrop accept="image/*" />
      </Demo>
      <Demo title="Wizard — multi-step form" hint="Steps con validación por paso." wide>
        <Wizard
          onComplete={() => {}}
          steps={[
            {
              id: "account",
              label: "Account",
              description: "Basic info to get started.",
              content: (
                <Col>
                  <TextField label="Full name" placeholder="Ada Lovelace" />
                  <TextField label="Email" placeholder="ada@example.com" />
                </Col>
              ),
            },
            {
              id: "workspace",
              label: "Workspace",
              description: "Name and region.",
              content: (
                <Col>
                  <TextField label="Workspace" placeholder="my-team" />
                  <Combobox
                    label="Region"
                    value="alpha"
                    onChange={() => {}}
                    options={[
                      { value: "alpha", label: "eu-west-1" },
                      { value: "beta", label: "us-east-1" },
                    ]}
                  />
                </Col>
              ),
            },
            {
              id: "confirm",
              label: "Confirm",
              description: "Ready to create.",
              content: (
                <div className="text-sm text-white/70">
                  Review your settings and click Finish to create the workspace.
                </div>
              ),
            },
          ]}
        />
      </Demo>

      <Demo title="Color swatch">
        <ColorSwatch
          label="Accent"
          value={color}
          onChange={setColor}
          colors={["#a855f7", "#38bdf8", "#f472b6", "#34d399", "#fbbf24", "#fb7185", "#64748b"]}
        />
      </Demo>
    </Group>
  );
}
