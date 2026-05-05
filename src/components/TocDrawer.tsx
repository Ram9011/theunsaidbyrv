import { chapters, partTitles, type Chapter } from "../data/chapters";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TocDrawerProps {
  currentChapterId: string;
  onNavigate: (chapterId: string) => void;
  onClose: () => void;
}

export function TocDrawer({ currentChapterId, onNavigate, onClose }: TocDrawerProps) {
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const s = new Set<string>();
    try {
      const saved = localStorage.getItem("tgwfhe_readPages");
      if (saved) JSON.parse(saved).forEach((id: string) => s.add(id));
    } catch {
      // Ignore parsing errors
    }
    chapters.forEach((ch) => {
      const p = localStorage.getItem(`reading-progress-${ch.id}`);
      if (p && Number(p) > 40) s.add(ch.id);
    });
    setReadSet(s);
  }, []);

  let lastPart = -1;

  return (
    <AnimatePresence>
      <div key="overlay" className="toc-overlay" onClick={onClose} />
      <motion.div
        key="sheet"
        className="toc-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="toc-handle" />
        <p className="toc-heading">Contents</p>

        {/* Cover link */}
        <div className="toc-row unread" onClick={() => onNavigate("/")}>
          <span className="toc-ch-name">Cover Page</span>
          <span className="toc-dots" />
          <span className="toc-pg">i</span>
        </div>

        {chapters.map((ch, idx) => {
          const showPart = ch.part !== lastPart;
          lastPart = ch.part;
          const isRead = readSet.has(ch.id);
          const isCurrent = ch.id === currentChapterId;
          const pgNum = idx + 1;

          return (
            <div key={ch.id}>
              {showPart && (
                <div className="toc-part-label">
                  {partTitles[ch.part] ?? `Part ${ch.part}`} · {ch.partTitle}
                </div>
              )}
              <div
                className={`toc-row ${isCurrent ? "current" : ""} ${!isRead ? "unread" : ""}`}
                onClick={() => onNavigate(ch.id)}
              >
                {isRead && !isCurrent && <span className="toc-read-dot" />}
                <span className="toc-ch-name">
                  {ch.chapterNumber === 0
                    ? "Prologue"
                    : ch.chapterNumber === 14
                      ? "Epilogue"
                      : `${ch.chapterNumber}. ${ch.title}`}
                </span>
                <span className="toc-dots" />
                <span className="toc-pg">{pgNum}</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
