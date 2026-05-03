import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ChatBubble } from "./ChatBubble";

describe("ChatBubble", () => {
  it("renders children text", () => {
    renderWithHarbor(<ChatBubble from="me">Hello!</ChatBubble>);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("renders author when provided", () => {
    renderWithHarbor(
      <ChatBubble from="them" author="Alice">
        Hi
      </ChatBubble>,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("does not render author when not provided", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me">No author</ChatBubble>,
    );
    // The author element is a div with text-[11px] class
    const authorDiv = container.querySelector(".text-\\[11px\\]");
    expect(authorDiv).toBeNull();
  });

  it("renders avatar when provided", () => {
    renderWithHarbor(
      <ChatBubble from="them" avatar={<span data-testid="avatar">A</span>}>
        Message
      </ChatBubble>,
    );
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("renders time when provided", () => {
    renderWithHarbor(<ChatBubble from="me" time="12:30">Msg</ChatBubble>);
    expect(screen.getByText("12:30")).toBeInTheDocument();
  });

  it("renders status sending", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me" time="now" status="sending">
        Sending
      </ChatBubble>,
    );
    // Status sending shows an animated spinner (span with animate-spin)
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeTruthy();
  });

  it("renders status sent", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me" time="now" status="sent">
        Sent
      </ChatBubble>,
    );
    // Sent status shows an SVG checkmark
    const statusSvg = container.querySelectorAll("svg");
    expect(statusSvg.length).toBeGreaterThanOrEqual(1);
  });

  it("renders status delivered", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me" time="now" status="delivered">
        Delivered
      </ChatBubble>,
    );
    const statusSvg = container.querySelectorAll("svg");
    expect(statusSvg.length).toBeGreaterThanOrEqual(1);
  });

  it("renders status read", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me" time="now" status="read">
        Read
      </ChatBubble>,
    );
    const statusSvg = container.querySelectorAll("svg");
    expect(statusSvg.length).toBeGreaterThanOrEqual(1);
  });

  it("renders reactions", () => {
    const reactions = [
      { emoji: "👍", count: 3 },
      { emoji: "❤️", count: 1 },
    ];
    const { container } = renderWithHarbor(
      <ChatBubble from="them" reactions={reactions}>
        React to this
      </ChatBubble>,
    );
    expect(screen.getByText("👍")).toBeInTheDocument();
    expect(screen.getByText("❤️")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies from='me' alignment classes", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me">Me message</ChatBubble>,
    );
    // from="me" applies ml-auto and flex-row-reverse
    const wrapper = container.querySelector(".ml-auto");
    expect(wrapper).toBeTruthy();
  });

  it("applies from='them' alignment classes", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="them">Them message</ChatBubble>,
    );
    // from="them" does NOT have ml-auto
    const wrapper = container.querySelector(".ml-auto");
    expect(wrapper).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me" className="my-bubble">
        Test
      </ChatBubble>,
    );
    const el = container.querySelector(".my-bubble");
    expect(el).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ChatBubble from="me" time="12:00" status="sent" author="Me">
        Accessible bubble
      </ChatBubble>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
