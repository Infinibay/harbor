import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Wizard, type WizardStep } from "./Wizard";

const threeSteps: WizardStep[] = [
  { id: "a", label: "Account", content: <div>Account body</div> },
  { id: "b", label: "Billing", content: <div>Billing body</div> },
  { id: "c", label: "Review", content: <div>Review body</div> },
];

describe("Wizard", () => {
  it("shows the first step initially", () => {
    renderWithHarbor(<Wizard steps={threeSteps} />);
    expect(screen.getByText("Account body")).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 3/)).toBeInTheDocument();
  });

  it("advances with Next and goes back with Back", async () => {
    const { user } = renderWithHarbor(<Wizard steps={threeSteps} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(screen.getByText("Billing body")).toBeInTheDocument(),
    );
    expect(screen.getByText(/Step 2 of 3/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() =>
      expect(screen.getByText("Account body")).toBeInTheDocument(),
    );
  });

  it("disables Back on the first step", () => {
    renderWithHarbor(<Wizard steps={threeSteps} />);
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });

  it("blocks Next when `validate` returns false", async () => {
    const validate = vi.fn().mockResolvedValue(false);
    const steps: WizardStep[] = [
      { id: "a", label: "A", content: <div>A body</div>, validate },
      { id: "b", label: "B", content: <div>B body</div> },
    ];
    const { user } = renderWithHarbor(<Wizard steps={steps} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(validate).toHaveBeenCalled();
    // Still on first step.
    expect(screen.getByText(/Step 1 of 2/)).toBeInTheDocument();
  });

  it("shows a custom error when `validate` returns a string", async () => {
    const steps: WizardStep[] = [
      {
        id: "a",
        label: "A",
        content: <div>A body</div>,
        validate: () => "Please fill the form",
      },
      { id: "b", label: "B", content: <div>B body</div> },
    ];
    const { user } = renderWithHarbor(<Wizard steps={steps} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Please fill the form")).toBeInTheDocument();
  });

  it("fires onComplete when Finish is clicked on the last step", async () => {
    const onComplete = vi.fn();
    const { user } = renderWithHarbor(
      <Wizard steps={threeSteps} onComplete={onComplete} />,
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(screen.getByText(/Step 2 of 3/)).toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(screen.getByText(/Step 3 of 3/)).toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Wizard steps={threeSteps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
