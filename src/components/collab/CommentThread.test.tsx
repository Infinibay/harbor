import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  CommentThread,
  Comment,
  CommentComposer,
} from "./CommentThread";

const ana = { name: "Ana" };
const bruno = { name: "Bruno" };

describe("CommentThread", () => {
  it("renders comments with author names", () => {
    renderWithHarbor(
      <CommentThread>
        <Comment id="1" author={ana} time="2h ago">
          Hello world
        </Comment>
      </CommentThread>,
    );
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders timestamps", () => {
    renderWithHarbor(
      <CommentThread>
        <Comment id="1" author={ana} time="2h ago">
          Message
        </Comment>
      </CommentThread>,
    );
    expect(screen.getByText("2h ago")).toBeInTheDocument();
  });

  it("renders nested replies", () => {
    renderWithHarbor(
      <CommentThread>
        <Comment id="1" author={ana} time="2h ago">
          Parent
          <Comment id="1a" author={bruno} time="1h ago">
            Reply text
          </Comment>
        </Comment>
      </CommentThread>,
    );
    expect(screen.getByText("Parent")).toBeInTheDocument();
    expect(screen.getByText("Reply text")).toBeInTheDocument();
    expect(screen.getByText("Bruno")).toBeInTheDocument();
  });

  it("renders reactions on a comment", () => {
    const reactions = [
      { emoji: "👍", count: 3, mine: false },
      { emoji: "❤️", count: 1, mine: true },
    ];
    renderWithHarbor(
      <CommentThread>
        <Comment id="1" author={ana} time="now" reactions={reactions}>
          Nice work
        </Comment>
      </CommentThread>,
    );
    expect(screen.getByText("👍")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("fires onReact when reaction button is clicked", async () => {
    const onReact = vi.fn();
    const reactions = [{ emoji: "👍", count: 1 }];
    const { user } = renderWithHarbor(
      <CommentThread onReact={onReact}>
        <Comment id="c1" author={ana} time="now" reactions={reactions}>
          React test
        </Comment>
      </CommentThread>,
    );
    const thumbBtn = screen.getByText("👍").closest("button")!;
    await user.click(thumbBtn);
    expect(onReact).toHaveBeenCalledWith("c1", "👍");
  });

  it("fires onReact with thumbs-up when + React is clicked", async () => {
    const onReact = vi.fn();
    const { user } = renderWithHarbor(
      <CommentThread onReact={onReact}>
        <Comment id="c1" author={ana} time="now">
          React button
        </Comment>
      </CommentThread>,
    );
    await user.click(screen.getByText("+ React"));
    expect(onReact).toHaveBeenCalledWith("c1", "👍");
  });

  it("shows Reply button when currentUser and onReply are set", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <Comment id="1" author={ana} time="now">
          With reply
        </Comment>
      </CommentThread>,
    );
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("hides Reply button when canReply=false", () => {
    renderWithHarbor(
      <CommentThread
        currentUser={{ name: "Me" }}
        onReply={vi.fn()}
        canReply={false}
      >
        <Comment id="1" author={ana} time="now">
          No reply
        </Comment>
      </CommentThread>,
    );
    expect(screen.queryByText("Reply")).toBeNull();
  });

  it("shows Reply composer after clicking Reply", async () => {
    const { user } = renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <Comment id="c1" author={ana} time="now">
          Click reply
        </Comment>
      </CommentThread>,
    );
    await user.click(screen.getByText("Reply"));
    expect(
      screen.getByPlaceholderText("Reply to Ana…"),
    ).toBeInTheDocument();
  });

  it("fires onReply when Post is clicked in reply composer", async () => {
    const onReply = vi.fn();
    const { user } = renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={onReply}>
        <Comment id="c1" author={ana} time="now">
          Test reply
        </Comment>
      </CommentThread>,
    );
    await user.click(screen.getByText("Reply"));
    const textarea = screen.getByPlaceholderText("Reply to Ana…");
    await user.type(textarea, "My reply");
    // Two Post buttons exist (reply composer + auto-generated composer).
    // Click the first one (reply composer) which is not disabled.
    const postButtons = screen.getAllByText("Post");
    const enabledPost = postButtons.find((btn) => !(btn as HTMLButtonElement).disabled)!;
    await user.click(enabledPost);
    expect(onReply).toHaveBeenCalledWith("c1", "My reply");
  });

  it("auto-renders CommentComposer when currentUser is set", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <Comment id="1" author={ana} time="now">
          Thread
        </Comment>
      </CommentThread>,
    );
    expect(
      screen.getByPlaceholderText("Write a comment…"),
    ).toBeInTheDocument();
  });

  it("does not auto-render composer when canComment=false", () => {
    renderWithHarbor(
      <CommentThread
        currentUser={{ name: "Me" }}
        onReply={vi.fn()}
        canComment={false}
      >
        <Comment id="1" author={ana} time="now">
          No composer
        </Comment>
      </CommentThread>,
    );
    expect(screen.queryByPlaceholderText("Write a comment…")).toBeNull();
  });

  it("does not duplicate composer if CommentComposer is a child", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer />
      </CommentThread>,
    );
    // Only one textarea should exist
    const textareas = screen.getAllByPlaceholderText("Write a comment…");
    expect(textareas.length).toBe(1);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <CommentThread className="my-thread">
        <Comment id="1" author={ana} time="now">
          Hello
        </Comment>
      </CommentThread>,
    );
    expect(container.querySelector(".my-thread")).toBeTruthy();
  });
});

describe("CommentComposer", () => {
  it("renders within CommentThread context", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer />
      </CommentThread>,
    );
    expect(
      screen.getByPlaceholderText("Write a comment…"),
    ).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
  });

  it("Post button is disabled when textarea is empty", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer />
      </CommentThread>,
    );
    expect(screen.getByText("Post")).toBeDisabled();
  });

  it("Post button is enabled after typing text", async () => {
    const { user } = renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer />
      </CommentThread>,
    );
    const textarea = screen.getByPlaceholderText("Write a comment…");
    await user.type(textarea, "My comment");
    expect(screen.getByText("Post")).not.toBeDisabled();
  });

  it("fires onReply with null parentId for top-level", async () => {
    const onReply = vi.fn();
    const { user } = renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={onReply}>
        <CommentComposer />
      </CommentThread>,
    );
    const textarea = screen.getByPlaceholderText("Write a comment…");
    await user.type(textarea, "Top level");
    await user.click(screen.getByText("Post"));
    expect(onReply).toHaveBeenCalledWith(null, "Top level");
  });

  it("uses custom placeholder", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer placeholder="Say something" />
      </CommentThread>,
    );
    expect(screen.getByPlaceholderText("Say something")).toBeInTheDocument();
  });

  it("shows Cancel button when onCancel is provided", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer onCancel={vi.fn()} />
      </CommentThread>,
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not show Cancel when onCancel is not provided", () => {
    renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer />
      </CommentThread>,
    );
    expect(screen.queryByText("Cancel")).toBeNull();
  });

  it("fires onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    const { user } = renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer onCancel={onCancel} />
      </CommentThread>,
    );
    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("throws when used outside CommentThread", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderWithHarbor(<CommentComposer />);
    }).toThrow("<CommentComposer> must be rendered inside <CommentThread>.");
    spy.mockRestore();
  });

  it("clears textarea after posting", async () => {
    const { user } = renderWithHarbor(
      <CommentThread currentUser={{ name: "Me" }} onReply={vi.fn()}>
        <CommentComposer />
      </CommentThread>,
    );
    const textarea = screen.getByPlaceholderText("Write a comment…");
    await user.type(textarea, "Clear me");
    await user.click(screen.getByText("Post"));
    expect(textarea).toHaveValue("");
  });
});

describe("a11y", () => {
  it("CommentThread: no violations", async () => {
    const { container } = renderWithHarbor(
      <CommentThread
        currentUser={{ name: "Me" }}
        onReply={vi.fn()}
        onReact={vi.fn()}
      >
        <Comment id="1" author={ana} time="2h ago">
          Accessible comment
          <Comment id="1a" author={bruno} time="1h ago">
            Nested reply
          </Comment>
        </Comment>
      </CommentThread>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
