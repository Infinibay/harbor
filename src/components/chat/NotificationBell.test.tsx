import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { NotificationBell, type Notification } from "./NotificationBell";

const notifications: Notification[] = [
  { id: "1", title: "New message", description: "You have a new message", time: "2m ago", unread: true },
  { id: "2", title: "Update", description: "System updated", time: "1h ago", unread: false },
  { id: "3", title: "Welcome", time: "1d ago" },
];

describe("NotificationBell", () => {
  it("renders the bell button with aria-label", () => {
    renderWithHarbor(<NotificationBell notifications={[]} />);
    expect(
      screen.getByRole("button", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("shows unread badge when there are unread notifications", () => {
    renderWithHarbor(<NotificationBell notifications={notifications} />);
    // 1 unread notification
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows '9+' when more than 9 unread", () => {
    const many: Notification[] = Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      title: `Notif ${i}`,
      time: "now",
      unread: true,
    }));
    renderWithHarbor(<NotificationBell notifications={many} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("does not show badge when all are read", () => {
    const readNotifs: Notification[] = [
      { id: "1", title: "Read", time: "now", unread: false },
    ];
    const { container } = renderWithHarbor(
      <NotificationBell notifications={readNotifs} />,
    );
    // No badge span
    const badge = container.querySelector("span.min-w-\\[16px\\]");
    expect(badge).toBeNull();
  });

  it("opens dropdown on bell click", async () => {
    const { user } = renderWithHarbor(
      <NotificationBell notifications={notifications} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("New message")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("shows Mark all read button when unread > 0 and onReadAll provided", async () => {
    const onReadAll = vi.fn();
    const { user } = renderWithHarbor(
      <NotificationBell notifications={notifications} onReadAll={onReadAll} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("Mark all read")).toBeInTheDocument();
  });

  it("fires onReadAll when button is clicked", async () => {
    const onReadAll = vi.fn();
    const { user } = renderWithHarbor(
      <NotificationBell notifications={notifications} onReadAll={onReadAll} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    await user.click(screen.getByText("Mark all read"));
    expect(onReadAll).toHaveBeenCalledTimes(1);
  });

  it("fires onRead when a notification is clicked", async () => {
    const onRead = vi.fn();
    const { user } = renderWithHarbor(
      <NotificationBell notifications={notifications} onRead={onRead} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    await user.click(screen.getByText("New message"));
    expect(onRead).toHaveBeenCalledWith("1");
  });

  it("shows 'You're all caught up' when no notifications", async () => {
    const { user } = renderWithHarbor(
      <NotificationBell notifications={[]} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("You're all caught up")).toBeInTheDocument();
  });

  it("renders notification icon when provided", async () => {
    const withIcon: Notification[] = [
      { id: "1", title: "Icon", time: "now", icon: <span data-testid="n-icon">🔔</span> },
    ];
    const { user } = renderWithHarbor(
      <NotificationBell notifications={withIcon} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByTestId("n-icon")).toBeInTheDocument();
  });

  it("renders notification description when provided", async () => {
    const { user } = renderWithHarbor(
      <NotificationBell notifications={notifications} />,
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("You have a new message")).toBeInTheDocument();
  });

  it("applies custom className to the bell button", () => {
    const { container } = renderWithHarbor(
      <NotificationBell notifications={[]} className="my-bell" />,
    );
    const btn = container.querySelector(".my-bell");
    expect(btn).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <NotificationBell notifications={[]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
