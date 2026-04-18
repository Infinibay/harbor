import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { Carousel } from "../../components";
import { Scrubber } from "../../components";
import { IconButton } from "../../components";
import { PlayIcon, PauseIcon } from "../../showcase/icons";
import { Lightbox, type LightboxImage } from "../../components";
import { CompareSlider } from "../../components";
import { SignaturePad } from "../../components";

const lightboxImages: LightboxImage[] = [
  {
    id: "l1",
    src: "https://picsum.photos/seed/purple/1200/800",
    alt: "",
    caption: "Cluster visualization · production east",
  },
  {
    id: "l2",
    src: "https://picsum.photos/seed/ocean/1200/800",
    caption: "Network topology",
  },
  {
    id: "l3",
    src: "https://picsum.photos/seed/forest/1200/800",
    caption: "Storage layout",
  },
];

export function MediaPage() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(34.2);
  const waveform = Array.from({ length: 64 }, () => Math.random() * 0.9 + 0.1);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);

  return (
    <Group id="media" title="Media · video" desc="Scrubbers, carousels, transport.">
      <Demo title="Video scrubber" hint="Buffered + chapter markers." wide intensity="soft">
        <Col>
          <Scrubber
            value={time}
            duration={180}
            onSeek={setTime}
            buffered={140}
            markers={[
              { time: 30, label: "Intro" },
              { time: 90, label: "Chapter 2" },
              { time: 140, label: "Outro" },
            ]}
          />
          <Row>
            <IconButton label="Prev" icon="⏮" variant="ghost" />
            <IconButton
              label={playing ? "Pause" : "Play"}
              icon={playing ? <PauseIcon /> : <PlayIcon />}
              onClick={() => setPlaying((p) => !p)}
            />
            <IconButton label="Next" icon="⏭" variant="ghost" />
          </Row>
        </Col>
      </Demo>

      <Demo title="Waveform scrubber" hint="Usado en audio/voice apps." wide intensity="soft">
        <Scrubber value={time} duration={180} onSeek={setTime} waveform={waveform} />
      </Demo>

      <Demo title="Carousel" wide intensity="soft">
        <Carousel
          slides={[
            {
              id: "1",
              content: (
                <div
                  className="absolute inset-0 grid place-items-center text-white text-2xl font-semibold"
                  style={{ background: "linear-gradient(135deg,#a855f7,#38bdf8)" }}
                >
                  Slide one
                </div>
              ),
            },
            {
              id: "2",
              content: (
                <div
                  className="absolute inset-0 grid place-items-center text-white text-2xl font-semibold"
                  style={{ background: "linear-gradient(135deg,#f472b6,#a855f7)" }}
                >
                  Slide two
                </div>
              ),
            },
            {
              id: "3",
              content: (
                <div
                  className="absolute inset-0 grid place-items-center text-white text-2xl font-semibold"
                  style={{ background: "linear-gradient(135deg,#34d399,#0ea5e9)" }}
                >
                  Slide three
                </div>
              ),
            },
          ]}
        />
      </Demo>

      <Demo title="Lightbox gallery" hint="Click una imagen; ←/→ para navegar." wide intensity="soft">
        <Col>
          <div className="grid grid-cols-3 gap-2 w-full">
            {lightboxImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => {
                  setLbIdx(i);
                  setLbOpen(true);
                }}
                className="rounded-lg overflow-hidden border border-white/10 aspect-video"
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <Lightbox
            images={lightboxImages}
            index={lbIdx}
            onIndexChange={setLbIdx}
            open={lbOpen}
            onClose={() => setLbOpen(false)}
          />
        </Col>
      </Demo>

      <Demo title="CompareSlider" hint="Arrastrá el handle." wide intensity="soft">
        <CompareSlider
          before="https://picsum.photos/seed/before/1200/700"
          after="https://picsum.photos/seed/after/1200/700"
          beforeLabel="v2.2"
          afterLabel="v2.3"
        />
      </Demo>

      <Demo title="SignaturePad" wide intensity="soft">
        <SignaturePad width={480} height={180} />
      </Demo>
    </Group>
  );
}
