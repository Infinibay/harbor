import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Scrubber } from "../../components";
import { Knob } from "../../components";
import { IconButton } from "../../components";
import { Slider } from "../../components";
import { Card } from "../../components";
import { PlayIcon, PauseIcon } from "../../showcase/icons";

export function MusicPage() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(82);
  const [volume, setVolume] = useState(70);
  const [cutoff, setCutoff] = useState(120);
  const [resonance, setResonance] = useState(35);
  const [drive, setDrive] = useState(60);
  const duration = 228;
  const waveform = Array.from({ length: 96 }, (_, i) =>
    0.3 + 0.7 * Math.abs(Math.sin(i * 0.4) * Math.cos(i * 0.1)),
  );

  const tracks = [
    { id: "1", title: "Deep Focus", artist: "Aurora", length: "3:48", playing: true },
    { id: "2", title: "Night Drive", artist: "Keyed Up", length: "4:12" },
    { id: "3", title: "Signal", artist: "Marcel Dettmann", length: "6:02" },
    { id: "4", title: "Cascade", artist: "Four Tet", length: "5:30" },
    { id: "5", title: "Orbit", artist: "Jon Hopkins", length: "7:14" },
  ];

  return (
    <Group id="music" title="Music player" desc="Transport, waveform, playlist, synth knobs.">
      <Demo title="Now playing" hint="Album art · track · waveform scrubber." wide>
        <Card className="w-full p-5">
          <div className="flex gap-5">
            <div
              className="w-28 h-28 rounded-xl flex-none"
              style={{
                background:
                  "linear-gradient(135deg,#a855f7 0%,#38bdf8 50%,#f472b6 100%)",
              }}
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-fuchsia-300/70">
                  Now playing
                </div>
                <div className="text-white text-lg font-semibold truncate">
                  Deep Focus — Aurora
                </div>
                <div className="text-white/50 text-xs">Album · Lights Out</div>
              </div>
              <Scrubber
                value={time}
                duration={duration}
                onSeek={setTime}
                waveform={waveform}
              />
              <Row className="justify-between">
                <Row>
                  <IconButton label="Shuffle" icon="🔀" variant="ghost" size="sm" />
                  <IconButton label="Prev" icon="⏮" variant="ghost" />
                  <IconButton
                    label={playing ? "Pause" : "Play"}
                    icon={playing ? <PauseIcon /> : <PlayIcon />}
                    size="lg"
                    onClick={() => setPlaying((p) => !p)}
                  />
                  <IconButton label="Next" icon="⏭" variant="ghost" />
                  <IconButton label="Repeat" icon="🔁" variant="ghost" size="sm" />
                </Row>
                <div className="w-32">
                  <Slider value={volume} onChange={setVolume} />
                </div>
              </Row>
            </div>
          </div>
        </Card>
      </Demo>

      <Demo title="Playlist" wide>
        <div className="w-full rounded-xl bg-white/[0.02] border border-white/8 overflow-hidden">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-white/5 ${
                t.playing ? "bg-white/[0.04]" : ""
              } ${i > 0 ? "border-t border-white/5" : ""}`}
            >
              <span className="w-5 text-xs text-white/40 font-mono text-right">
                {t.playing ? "▶" : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`truncate ${
                    t.playing ? "text-white font-medium" : "text-white/80"
                  }`}
                >
                  {t.title}
                </div>
                <div className="text-xs text-white/40 truncate">{t.artist}</div>
              </div>
              <span className="text-xs text-white/40 font-mono tabular-nums">
                {t.length}
              </span>
            </button>
          ))}
        </div>
      </Demo>

      <Demo title="Synth rack" hint="Arrastrá los knobs, Shift = fino." wide>
        <Row attention>
          <Knob label="Cutoff" value={cutoff} onChange={setCutoff} unit="Hz" max={200} />
          <Knob label="Resonance" value={resonance} onChange={setResonance} />
          <Knob label="Drive" value={drive} onChange={setDrive} unit="dB" max={100} />
          <Knob label="Reverb" defaultValue={22} />
          <Knob label="Delay" defaultValue={8} />
          <Knob label="Mix" defaultValue={50} unit="%" />
        </Row>
      </Demo>

      <Demo title="Level meters" hint="VU visuals (estáticos, demo).">
        <Col>
          {["L", "R"].map((ch) => (
            <Row key={ch} className="items-center gap-2">
              <span className="text-xs font-mono text-white/50 w-4">{ch}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: ch === "L" ? "78%" : "62%",
                    background:
                      "linear-gradient(90deg,#34d399 0%,#fbbf24 70%,#f87171 100%)",
                  }}
                />
              </div>
              <span className="text-xs font-mono text-white/50 tabular-nums">
                {ch === "L" ? "-3.2" : "-5.1"} dB
              </span>
            </Row>
          ))}
        </Col>
      </Demo>
    </Group>
  );
}
