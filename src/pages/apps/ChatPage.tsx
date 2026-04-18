import { useState } from "react";
import { Group, Demo } from "../../showcase/ShowcaseCard";
import { ChatBubble } from "../../components";
import { TypingIndicator } from "../../components";
import { ChatInput } from "../../components";
import { EmojiPicker } from "../../components";
import { Avatar } from "../../components";

export function ChatPage() {
  const [chatMessages, setChatMessages] = useState<
    { id: number; from: "me" | "them"; text: string; time: string }[]
  >([
    { id: 1, from: "them", text: "Hey — did you see the metrics spike at 14:02?", time: "14:05" },
    { id: 2, from: "me", text: "Yep, investigating now.", time: "14:06" },
    { id: 3, from: "them", text: "Looks like a bad deploy of auth-service. Rolling back?", time: "14:07" },
  ]);
  const [typing, setTyping] = useState(false);

  function sendChat(text: string) {
    const id = Date.now();
    setChatMessages((m) => [...m, { id, from: "me", text, time: "now" }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setChatMessages((m) => [...m, { id: id + 1, from: "them", text: "got it — on it.", time: "now" }]);
    }, 1600);
  }

  return (
    <Group id="chat" title="Chat · social" desc="Bubbles, typing, emoji picker.">
      <Demo title="Chat panel" wide>
        <div className="w-full flex flex-col gap-3 h-[380px]">
          <div className="flex-1 overflow-auto flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/8">
            {chatMessages.map((m) => (
              <ChatBubble
                key={m.id}
                from={m.from}
                time={m.time}
                avatar={m.from === "them" ? <Avatar name="Leo Park" size="sm" /> : null}
                reactions={m.id === 1 ? [{ emoji: "👀", count: 2 }] : undefined}
                status={m.from === "me" ? "read" : undefined}
              >
                {m.text}
              </ChatBubble>
            ))}
            {typing ? <TypingIndicator name="Leo Park" /> : null}
          </div>
          <ChatInput onSend={sendChat} />
        </div>
      </Demo>
      <Demo title="Emoji picker" wide>
        <EmojiPicker onPick={() => {}} />
      </Demo>
    </Group>
  );
}
