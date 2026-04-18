import { useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface FileDropProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  hint?: string;
}

export function FileDrop({
  onFiles,
  accept,
  multiple = true,
  hint = "Drag files or click to browse",
  className,
}: FileDropProps) {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles((prev) => (multiple ? [...prev, ...arr].slice(0, 8) : arr));
    onFiles?.(arr);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setOver(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <motion.label
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        data-cursor="drag"
        data-cursor-label="Drop"
        animate={{
          scale: over ? 1.015 : 1,
          borderColor: over
            ? "rgba(168, 85, 247, 0.8)"
            : "rgba(255, 255, 255, 0.12)",
          background: over
            ? "rgba(168, 85, 247, 0.08)"
            : "rgba(255, 255, 255, 0.02)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative cursor-pointer rounded-2xl border-2 border-dashed p-6 flex flex-col items-center gap-2 text-center"
      >
        <motion.svg
          animate={
            over
              ? { y: [-2, 2, -2], rotate: [0, -4, 4, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: 1.3,
            repeat: over ? Infinity : 0,
            ease: "easeInOut",
          }}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/60"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </motion.svg>
        <span className="text-sm text-white/75 font-medium">
          {over ? "Release to upload" : hint}
        </span>
        <span className="text-xs text-white/40">
          {accept ? `Accepted: ${accept}` : "Any file type"}
        </span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </motion.label>
      <AnimatePresence initial={false}>
        {files.length > 0 ? (
          <motion.ul
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            {files.map((f, i) => (
              <motion.li
                key={f.name + i}
                layout
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 12, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/5"
              >
                <span className="text-white/80 truncate font-mono">
                  {f.name}
                </span>
                <span className="text-white/40 font-mono ml-3">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
