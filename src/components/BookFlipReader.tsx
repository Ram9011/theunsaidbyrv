import { useState, useRef, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { type ContentBlock } from "../data/chapters";
import { type Reaction } from "../hooks/useReactions";

/* ─── Types ──────────────────────────────────────────── */
interface Page {
  blocks: ContentBlock[];
  showHeader: boolean;
  pageNum: number;
  startIndex: number;
}

interface BookFlipReaderProps {
  pages: Page[];
  fontSize: number;
  isMobile: boolean;
  onSpreadChange: (spreadIndex: number, totalSpreads: number) => void;
  chapterId: string;
  chapterNum: number;
  chapterTitle: string;
  reactions?: Reaction[];
  onReactionTap?: (emoji: string, paragraphIndex: number) => void;
}

/* ─── Helpers ────────────────────────────────────────── */
const DURATION = 700;
const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1.000)";

function playPaperSound() {
  try {
    if (localStorage.getItem("tgwfhe_sound") === "off") return;
    const audioContextClass =
      (window as unknown as Record<string, typeof AudioContext>).AudioContext ||
      (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext;
    const ctx = new audioContextClass();
    const n = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.07, ctx.currentTime);
    g.gain.setTargetAtTime(0, ctx.currentTime + 0.04, 0.015);
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    /* silent */
  }
}

/* ─── PageContent ────────────────────────────────────── */
export function PageContent({
  page,
  fontSize,
  reactions,
  onReactionTap,
}: {
  page?: Page;
  fontSize: number;
  reactions?: Reaction[];
  onReactionTap?: (emoji: string, paragraphIndex: number) => void;
}) {
  if (!page) return <div style={{ flex: 1 }} />;

  return (
    <div className="page-content fade-in">
      {page.showHeader && (
        <div className="chapter-header">
          <span className="chapter-num">{page.pageNum === 1 ? "Chapter" : ""}</span>
          <div className="chapter-rule" />
        </div>
      )}
      {page.blocks.map((b, i) => {
        const globalIdx = (page.startIndex ?? 0) + i;

        if (b.type === "divider")
          return (
            <div key={i} className="scene-break">
              ✦
            </div>
          );
        if (b.type === "pullquote")
          return (
            <blockquote key={i} className="pull-quote">
              {b.text}
            </blockquote>
          );

        const isDropCap = page.showHeader && i === 0 && b.type === "paragraph";

        // Gather reactions for this paragraph
        const paraReactions = reactions?.filter((r) => r.paragraphIndex === globalIdx) ?? [];
        // Group by type
        const grouped: Record<string, number> = {};
        paraReactions.forEach((r) => {
          const key =
            (r as { type?: string; emoji?: string }).type ??
            (r as { emoji?: string }).emoji ??
            "felt_this";
          grouped[key] = (grouped[key] || 0) + 1;
        });
        const reactionEntries = Object.entries(grouped);

        return (
          <div key={i} className="para-with-reactions">
            <p
              className={`body-text${isDropCap ? " drop-cap" : ""}`}
              style={{ fontSize }}
              data-paragraph-index={globalIdx}
            >
              {b.text}
            </p>
            {reactionEntries.length > 0 && (
              <div className="reaction-pills">
                {reactionEntries.map(([rtype, count]) => (
                  <span
                    key={rtype}
                    className="reaction-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReactionTap?.(rtype, globalIdx);
                    }}
                  >
                    <span className="reaction-pill-emoji">{rtype}</span>
                    {count > 1 && <span className="reaction-pill-count">{count}</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── BookFlipReader ─────────────────────────────────── */
export function BookFlipReader({
  pages,
  fontSize,
  isMobile,
  onSpreadChange,
  chapterId,
  reactions,
  onReactionTap,
}: BookFlipReaderProps) {
  const totalSpreads = isMobile ? pages.length : Math.ceil(pages.length / 2);
  const [spread, setSpread] = useState(0);
  const [anim, setAnim] = useState<null | { dir: "fwd" | "bwd"; target: number; progress: number }>(
    null,
  );
  const [shadowAlpha, setShadowAlpha] = useState(0);

  const rafRef = useRef<number | null>(null);
  const t0 = useRef(0);
  const touchX0 = useRef(0);
  const mouseX0 = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSpread(0);
    setAnim(null);
  }, [chapterId]);

  useEffect(() => {
    onSpreadChange(spread, totalSpreads);
  }, [spread, totalSpreads, onSpreadChange]);

  const getPages = (si: number) => {
    if (isMobile) return { left: pages[si], right: undefined };
    return { left: pages[si * 2], right: pages[si * 2 + 1] };
  };

  const flip = useCallback(
    (dir: "fwd" | "bwd") => {
      if (anim) return;
      const target = dir === "fwd" ? spread + 1 : spread - 1;
      if (target < 0 || target >= totalSpreads) return;

      setAnim({ dir, target, progress: 0 });
      t0.current = performance.now();
      if (navigator.vibrate) navigator.vibrate(20);
      playPaperSound();

      const tick = (now: number) => {
        const t = Math.min((now - t0.current) / DURATION, 1);
        setShadowAlpha(Math.sin(t * Math.PI) * 0.38);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setSpread(target);
          setAnim(null);
          setShadowAlpha(0);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [anim, spread, totalSpreads],
  );

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flip("fwd");
      if (e.key === "ArrowLeft") flip("bwd");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [flip]);

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    touchX0.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX0.current;
    if (dx < -50) flip("fwd");
    else if (dx > 50) flip("bwd");
  };

  // Mouse (drag or tap zones)
  const onMouseDown = (e: React.MouseEvent) => {
    mouseX0.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    const dx = e.clientX - mouseX0.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) flip("fwd");
      else flip("bwd");
    } else {
      // Tap zones
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio < 0.35) flip("bwd");
      else if (ratio > 0.65) flip("fwd");
      // center 30% → handled by parent (toolbar toggle)
    }
  };

  const bgSpread = anim ? anim.target : spread;
  const srcSpread = spread;
  const tgt = anim ? anim.target : null;

  const bg = getPages(bgSpread);
  const src = getPages(srcSpread);
  const tgtPages = tgt !== null ? getPages(tgt) : null;

  const isFlipping = !!anim;
  const fwd = anim?.dir === "fwd";

  // Angle: fwd 0→-180, bwd 0→180
  const angle = isFlipping ? (fwd ? -180 : 180) : 0;

  // The leaf for forward: starts on RIGHT side, front=src.right, back=tgt.left
  // The leaf for backward: starts on LEFT side, front=src.left, back=tgt.right
  const leafFront = isFlipping ? (fwd ? src.right : src.left) : undefined;
  const leafBack = isFlipping && tgtPages ? (fwd ? tgtPages.left : tgtPages.right) : undefined;

  const leafClass = fwd ? "flip-leaf--fwd" : "flip-leaf--bwd";
  const shadowClass = fwd ? "flip-shadow--bwd" : "flip-shadow--fwd"; // shadow falls on the OPPOSITE side

  return (
    <div
      ref={stageRef}
      className="book-stage"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{ userSelect: isFlipping ? "none" : "auto", cursor: "default" }}
    >
      <div className="book-spread" style={{ perspective: 2500 }}>
        {/* ── Static background spread ── */}
        <div className="page-panel page-panel--left">
          <PageContent
            page={bg.left}
            fontSize={fontSize}
            reactions={reactions}
            onReactionTap={onReactionTap}
          />
          <div className="page-num">{bgSpread * (isMobile ? 1 : 2) + 1}</div>
          {isFlipping && fwd && (
            <div className="flip-shadow flip-shadow--fwd" style={{ opacity: shadowAlpha / 0.38 }} />
          )}
        </div>

        {!isMobile && <div className="book-spine" />}

        {!isMobile && (
          <div className="page-panel page-panel--right">
            <PageContent
              page={bg.right}
              fontSize={fontSize}
              reactions={reactions}
              onReactionTap={onReactionTap}
            />
            {bg.right && <div className="page-num">{bgSpread * 2 + 2}</div>}
            {isFlipping && !fwd && (
              <div
                className="flip-shadow flip-shadow--bwd"
                style={{ opacity: shadowAlpha / 0.38 }}
              />
            )}
          </div>
        )}

        {/* ── Flip leaf (CSS 3D) ── */}
        {isFlipping && (
          <div
            className={`flip-leaf ${leafClass}`}
            style={{
              transform: `rotateY(${angle}deg)`,
              transition: `transform ${DURATION}ms ${EASE}`,
            }}
          >
            {/* Front face */}
            <div className={`leaf-face ${fwd ? "leaf-face--right" : "leaf-face--left"}`}>
              <PageContent
                page={leafFront}
                fontSize={fontSize}
                reactions={reactions}
                onReactionTap={onReactionTap}
              />
            </div>
            {/* Back face */}
            <div
              className={`leaf-face leaf-face--back ${fwd ? "leaf-face--left" : "leaf-face--right"}`}
            >
              <PageContent
                page={leafBack}
                fontSize={fontSize}
                reactions={reactions}
                onReactionTap={onReactionTap}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
