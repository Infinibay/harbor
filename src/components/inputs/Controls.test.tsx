import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Checkbox } from "./Checkbox";
import { Calendar } from "./Calendar";
import { CronBuilder } from "./CronBuilder";
import { DiskAllocator } from "./DiskAllocator";
import { FieldSet } from "./FieldSet";
import { FileDrop } from "./FileDrop";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import { HotkeyRecorder } from "./HotkeyRecorder";
import { Knob } from "./Knob";
import { MFASetup } from "./MFASetup";
import { MultiSelect } from "./MultiSelect";
import { NumberField } from "./NumberField";
import { PasswordStrength } from "./PasswordStrength";
import { RangeSlider } from "./RangeSlider";
import { Radio, RadioGroup } from "./Radio";
import { Rating } from "./Rating";
import { SearchField } from "./SearchField";
import { Select } from "./Select";
import { Slider } from "./Slider";
import { SliderField } from "./SliderField";
import { Switch } from "./Switch";
import { TagInput } from "./TagInput";
import { Textarea } from "./Textarea";
import { TextField } from "./TextField";
import { ToggleGroup } from "./ToggleGroup";
import { Wizard } from "./Wizard";
import { ZoomControls } from "./ZoomControls";

describe("input controls", () => {
  it("renders core controls against the default light theme", () => {
    renderWithHarbor(
      <>
        <FormSection title="Profile" description="Default form surface">
          <FieldSet legend="Identity" description="Personal details">
            <FormField label="Display name" helper="Shown to teammates">
              <TextField />
            </FormField>
          </FieldSet>
        </FormSection>
        <TextField label="Project" hint="Visible helper copy" />
        <Textarea label="Notes" maxChars={120} />
        <NumberField label="Seats" unit="users" defaultValue={3} />
        <Slider label="CPU" defaultValue={35} snap={[25, 50, 75]} />
        <RangeSlider label="Latency window" defaultValue={[10, 90]} />
        <SliderField
          value={4}
          min={1}
          max={8}
          unit="cores"
          limit={6}
          limitLabel="Max available"
          onChange={() => {}}
        />
        <PasswordStrength value="CorrectHorseBattery1!" />
        <Rating value={3} />
        <FileDrop accept=".csv" />
        <Calendar value={new Date(2026, 4, 24)} />
        <CronBuilder value="*/15 * * * *" onChange={() => {}} />
        <HotkeyRecorder value={["Meta", "k"]} />
        <ZoomControls value={100} onChange={() => {}} onFit={() => {}} />
        <Knob label="Gain" value={42} />
        <DiskAllocator
          total={100}
          allocations={[{ id: "sys", label: "System", size: 40, tone: "used" }]}
          header={<span>Storage</span>}
        />
        <MFASetup
          user="ada@example.com"
          secret="JBSWY3DPEHPK3PXP"
          recoveryCodes={["A1B2-C3D4", "E5F6-G7H8"]}
        />
        <Wizard
          steps={[
            { id: "setup", label: "Setup", content: <div>Setup body</div> },
            { id: "review", label: "Review", content: <div>Review body</div> },
          ]}
        />
        <TagInput label="Tags" defaultValue={["prod"]} />
        <MultiSelect
          label="Teams"
          value={["eng"]}
          options={[
            { value: "eng", label: "Engineering" },
            { value: "ops", label: "Operations" },
          ]}
        />
        <SearchField placeholder="Search records" />
        <Select
          label="Region"
          placeholder="Choose region"
          options={[
            { value: "us", label: "United States" },
            { value: "ar", label: "Argentina" },
          ]}
        />
        <Checkbox label="Accept terms" description="Required for access." />
        <Switch label="Email alerts" description="Critical incidents only." />
        <RadioGroup value="manual" onChange={() => {}}>
          <Radio value="auto" label="Automatic" />
          <Radio value="manual" label="Manual" description="Review first." />
        </RadioGroup>
        <ToggleGroup
          items={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
          ]}
          defaultValue="grid"
        />
      </>,
      { theme: "harbor-light" },
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Identity")).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByLabelText("Project")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Seats")).toBeInTheDocument();
    expect(screen.getByText("CPU")).toBeInTheDocument();
    expect(screen.getByText("Latency window")).toBeInTheDocument();
    expect(screen.getByText(/Max available/)).toBeInTheDocument();
    expect(screen.getByText("Very strong")).toBeInTheDocument();
    expect(screen.getByText("Accepted: .csv")).toBeInTheDocument();
    expect(screen.getByText("May 2026")).toBeInTheDocument();
    expect(screen.getByText("Every 15 minutes")).toBeInTheDocument();
    expect(screen.getByText("⌘")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
    expect(screen.getByText("Gain")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Scan the QR code with your authenticator app.")).toBeInTheDocument();
    expect(screen.getByText("Setup body")).toBeInTheDocument();
    expect(screen.getByText("prod")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Engineering/ })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(5);
    expect(screen.getByPlaceholderText("Search records")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Choose region/ })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Accept terms/ })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Email alerts/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Manual/ })).toBeChecked();
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("emits changes from checkbox, radio, switch and toggle group", async () => {
    const onSearch = vi.fn(() => [
      { id: "1", title: "Argentina", subtitle: "South America" },
    ]);
    const onSelectChange = vi.fn();
    const onNumberChange = vi.fn();
    const onRatingChange = vi.fn();
    const onFiles = vi.fn();
    const onCronChange = vi.fn();
    const onHotkeyChange = vi.fn();
    const onZoomChange = vi.fn();
    const onDiskChange = vi.fn();
    const onMfaComplete = vi.fn();
    const onTagChange = vi.fn();
    const onMultiChange = vi.fn();
    const onCheckboxChange = vi.fn();
    const onRadioChange = vi.fn();
    const onSwitchChange = vi.fn();
    const onToggleChange = vi.fn();
    const { user } = renderWithHarbor(
      <>
        <NumberField label="Seats" defaultValue={3} onChange={onNumberChange} />
        <Rating value={0} onChange={onRatingChange} />
        <FileDrop onFiles={onFiles} />
        <CronBuilder value="* * * * *" onChange={onCronChange} />
        <HotkeyRecorder onChange={onHotkeyChange} />
        <ZoomControls value={100} onChange={onZoomChange} />
        <DiskAllocator
          total={100}
          allocations={[{ id: "sys", label: "System", size: 40, tone: "used" }]}
          onChange={onDiskChange}
        />
        <MFASetup
          user="ada@example.com"
          secret="JBSWY3DPEHPK3PXP"
          recoveryCodes={["A1B2-C3D4", "E5F6-G7H8"]}
          onComplete={onMfaComplete}
        />
        <TagInput label="Tags" onChange={onTagChange} />
        <MultiSelect
          label="Teams"
          value={[]}
          options={[
            { value: "eng", label: "Engineering" },
            { value: "ops", label: "Operations" },
          ]}
          onChange={onMultiChange}
        />
        <SearchField
          placeholder="Search records"
          onSearch={onSearch}
        />
        <Select
          placeholder="Choose region"
          options={[
            { value: "us", label: "United States" },
            { value: "ar", label: "Argentina" },
          ]}
          onChange={onSelectChange}
        />
        <Checkbox label="Accept terms" onChange={onCheckboxChange} />
        <Switch label="Email alerts" onChange={onSwitchChange} />
        <RadioGroup value="auto" onChange={onRadioChange}>
          <Radio value="auto" label="Automatic" />
          <Radio value="manual" label="Manual" />
        </RadioGroup>
        <ToggleGroup
          items={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
          ]}
          onChange={onToggleChange}
        />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "Rate 3 of 5" }));
    const uploadInput = screen
      .getByText("Any file type")
      .parentElement?.querySelector<HTMLInputElement>("input[type='file']");
    expect(uploadInput).toBeTruthy();
    await user.upload(
      uploadInput!,
      new File(["id,name"], "accounts.csv", { type: "text/csv" }),
    );
    await user.click(screen.getByRole("button", { name: "Daily @ 3 AM" }));
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    await user.click(screen.getByRole("button", { name: "Click to record" }));
    await user.keyboard("{Control>}k{/Control}");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.type(await screen.findByLabelText("Authenticator code"), "123456");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(await screen.findByLabelText("I've saved these codes somewhere safe"));
    await user.click(screen.getByRole("button", { name: "Finish" }));
    await user.type(screen.getByPlaceholderText("Add tag…"), "urgent{Enter}");
    await user.click(screen.getByRole("button", { name: /Select options/ }));
    await user.click(screen.getByText("Engineering"));
    await user.type(screen.getByPlaceholderText("Search records"), "arg");
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("arg"));
    await user.click(screen.getByRole("button", { name: /Choose region/ }));
    await user.click(screen.getByText("United States"));
    await user.click(screen.getByLabelText("Accept terms"));
    await user.click(screen.getByLabelText("Email alerts"));
    await user.click(screen.getByRole("radio", { name: "Manual" }));
    await user.click(screen.getByRole("button", { name: "Grid" }));

    expect(onNumberChange).toHaveBeenCalledWith(4);
    expect(onRatingChange).toHaveBeenCalledWith(3);
    expect(onFiles).toHaveBeenCalledWith([
      expect.objectContaining({ name: "accounts.csv" }),
    ]);
    expect(onCronChange).toHaveBeenCalledWith("0 3 * * *");
    expect(onZoomChange).toHaveBeenCalledWith(110);
    expect(onHotkeyChange).toHaveBeenCalledWith(["Control", "k"]);
    expect(onMfaComplete).toHaveBeenCalledTimes(1);
    expect(onTagChange).toHaveBeenCalledWith(["urgent"]);
    expect(onMultiChange).toHaveBeenCalledWith(["eng"]);
    expect(onSearch).toHaveBeenCalledWith("arg");
    expect(onSelectChange).toHaveBeenCalledWith("us");
    expect(onCheckboxChange).toHaveBeenCalledTimes(1);
    expect(onSwitchChange).toHaveBeenCalledTimes(1);
    expect(onRadioChange).toHaveBeenCalledWith("manual");
    expect(onToggleChange).toHaveBeenCalledWith("grid");
  });

  it("a11y: core controls have no violations", async () => {
    const { container } = renderWithHarbor(
      <>
        <FormSection title="Profile" description="Default form surface">
          <FieldSet legend="Identity" description="Personal details">
            <FormField label="Display name" helper="Shown to teammates">
              <TextField />
            </FormField>
          </FieldSet>
        </FormSection>
        <Checkbox label="Accept terms" description="Required for access." />
        <TextField label="Project" hint="Visible helper copy" />
        <Textarea label="Notes" maxChars={120} />
        <NumberField label="Seats" unit="users" defaultValue={3} />
        <Slider label="CPU" defaultValue={35} snap={[25, 50, 75]} />
        <RangeSlider label="Latency window" defaultValue={[10, 90]} />
        <SliderField
          value={4}
          min={1}
          max={8}
          unit="cores"
          limit={6}
          limitLabel="Max available"
          onChange={() => {}}
        />
        <PasswordStrength value="CorrectHorseBattery1!" />
        <Rating value={3} />
        <FileDrop accept=".csv" />
        <Calendar value={new Date(2026, 4, 24)} />
        <CronBuilder value="*/15 * * * *" onChange={() => {}} />
        <HotkeyRecorder value={["Meta", "k"]} />
        <ZoomControls value={100} onChange={() => {}} onFit={() => {}} />
        <Knob label="Gain" value={42} />
        <DiskAllocator
          total={100}
          allocations={[{ id: "sys", label: "System", size: 40, tone: "used" }]}
          header={<span>Storage</span>}
        />
        <MFASetup
          user="ada@example.com"
          secret="JBSWY3DPEHPK3PXP"
          recoveryCodes={["A1B2-C3D4", "E5F6-G7H8"]}
        />
        <Wizard
          steps={[
            { id: "setup", label: "Setup", content: <div>Setup body</div> },
            { id: "review", label: "Review", content: <div>Review body</div> },
          ]}
        />
        <TagInput label="Tags" defaultValue={["prod"]} />
        <MultiSelect
          label="Teams"
          value={["eng"]}
          options={[
            { value: "eng", label: "Engineering" },
            { value: "ops", label: "Operations" },
          ]}
        />
        <SearchField placeholder="Search records" />
        <Select
          label="Region"
          placeholder="Choose region"
          options={[
            { value: "us", label: "United States" },
            { value: "ar", label: "Argentina" },
          ]}
        />
        <Switch label="Email alerts" description="Critical incidents only." />
        <RadioGroup value="manual" onChange={() => {}}>
          <Radio value="auto" label="Automatic" />
          <Radio value="manual" label="Manual" description="Review first." />
        </RadioGroup>
        <ToggleGroup
          items={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
          ]}
          defaultValue="grid"
        />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
