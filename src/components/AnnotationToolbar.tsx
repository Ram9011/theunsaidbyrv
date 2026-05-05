import { useCallback, useEffect, useRef, useState } from "react";
import { REACTION_CATEGORIES } from "../hooks/useReactions";

interface AnnotationToolbarProps {
  onHighlight: (
    text: string,
    pIdx: number,
    start: number,
    end: number,
    color?: "yellow" | "pink" | "green",
  ) => void;
  onUnderline: (text: string, pIdx: number, start: number, end: number) => void;
  onAddNote: (text: string, pIdx: number, start: number, end: number) => void;
  onSave?: (text: string, pIdx: number) => void;
  onReact?: (emoji: string, text: string, pIdx: number) => void;
}

export function AnnotationToolbar({
  onHighlight,
  onUnderline,
  onAddNote,
  onSave,
  onReact,
}: AnnotationToolbarProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [selInfo, setSelInfo] = useState<{
    text: string;
    pIdx: number;
    start: number;
    end: number;
  } | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const checkSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setPos(null);
      setSelInfo(null);
      setShowPicker(false);
      return;
    }
    const text = sel.toString().trim();
    if (!text) {
      setPos(null);
      setSelInfo(null);
      setShowPicker(false);
      return;
    }

    const range = sel.getRangeAt(0);
    let node: Node | null = range.startContainer;
    let pEl: HTMLElement | null = null;

    // Search up through parents for data-paragraph-index
    while (node) {
      if (node instanceof HTMLElement && node.dataset.paragraphIndex !== undefined) {
        pEl = node;
        break;
      }
      node = node.parentElement;
    }

    // If not found in parents, try the common ancestor
    if (!pEl) {
      const commonAncestor = range.commonAncestorContainer;
      node = commonAncestor instanceof HTMLElement ? commonAncestor : commonAncestor.parentElement;
      while (node) {
        if (node instanceof HTMLElement && node.dataset.paragraphIndex !== undefined) {
          pEl = node;
          break;
        }
        node = node.parentElement;
      }
    }

    if (!pEl) {
      setPos(null);
      return;
    }

    const pIdx = parseInt(pEl.dataset.paragraphIndex ?? "0", 10);
    const rect = range.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setSelInfo({ text, pIdx, start: range.startOffset, end: range.endOffset });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, [checkSelection]);

  const clear = () => {
    window.getSelection()?.removeAllRanges();
    setPos(null);
    setSelInfo(null);
    setShowPicker(false);
    setShowColorPicker(false);
  };

  if (!pos || !selInfo) return null;

  const toolbarLeft = Math.max(8, Math.min(pos.x - 110, window.innerWidth - 240));
  const toolbarTop = Math.max(8, pos.y - 52);

  const btnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
    transition: "background 0.15s",
  };

  return (
    <>
      {/* Selection action bar */}
      <div
        ref={toolbarRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          left: toolbarLeft,
          top: toolbarTop,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "#1a1a24",
          border: "1px solid rgba(201,169,110,0.3)",
          borderRadius: 10,
          padding: "4px 6px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Highlight with color picker */}
        <button
          style={{ ...btnStyle, background: showColorPicker ? "rgba(201,169,110,0.12)" : "none" }}
          title="Highlight"
          onClick={() => setShowColorPicker((v) => !v)}
        >
          <span
            style={{
              background: "rgba(201,169,110,0.4)",
              padding: "0 4px",
              borderRadius: 3,
              fontSize: "0.75rem",
              color: "#f0dfa0",
            }}
          >
            H
          </span>
        </button>

        {/* Underline */}
        <button
          style={btnStyle}
          title="Underline"
          onClick={() => {
            onUnderline(selInfo.text, selInfo.pIdx, selInfo.start, selInfo.end);
            clear();
          }}
        >
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "#c9a96e",
              fontSize: "0.75rem",
              color: "#ddd",
            }}
          >
            U
          </span>
        </button>

        {/* Note */}
        <button
          style={btnStyle}
          title="Add Note"
          onClick={() => {
            onAddNote(selInfo.text, selInfo.pIdx, selInfo.start, selInfo.end);
            clear();
          }}
        >
          <span style={{ fontSize: "0.85rem" }}>📝</span>
        </button>

        {/* Save to shelf */}
        {onSave && (
          <button
            style={btnStyle}
            title="Save to Memory Shelf"
            onClick={() => {
              onSave(selInfo.text, selInfo.pIdx);
              clear();
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>🔖</span>
          </button>
        )}

        {/* Divider */}
        <div
          style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 2px" }}
        />

        {/* React */}
        {onReact && (
          <button
            style={{ ...btnStyle, background: showPicker ? "rgba(201,169,110,0.12)" : "none" }}
            title="React"
            onClick={() => setShowPicker((v) => !v)}
          >
            <span style={{ fontSize: "1rem" }}>😊</span>
          </button>
        )}
      </div>

      {/* Color picker for highlights */}
      {showColorPicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            left: Math.max(8, Math.min(pos.x - 90, window.innerWidth - 200)),
            top: toolbarTop + 50,
            zIndex: 201,
            background: "#1a1a24",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: 12,
            padding: "0.75rem",
            display: "flex",
            gap: "0.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          <button
            onClick={() => {
              onHighlight(selInfo.text, selInfo.pIdx, selInfo.start, selInfo.end, "yellow");
              clear();
            }}
            title="Yellow highlight"
            style={{
              width: 40,
              height: 40,
              background: "rgba(255, 220, 0, 0.4)",
              border: "2px solid #ffdc00",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 220, 0, 0.6)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 220, 0, 0.4)")}
          >
            🟡
          </button>
          <button
            onClick={() => {
              onHighlight(selInfo.text, selInfo.pIdx, selInfo.start, selInfo.end, "pink");
              clear();
            }}
            title="Pink highlight"
            style={{
              width: 40,
              height: 40,
              background: "rgba(232, 140, 158, 0.4)",
              border: "2px solid #e88c9e",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(232, 140, 158, 0.6)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(232, 140, 158, 0.4)")}
          >
            🩷
          </button>
          <button
            onClick={() => {
              onHighlight(selInfo.text, selInfo.pIdx, selInfo.start, selInfo.end, "green");
              clear();
            }}
            title="Green highlight"
            style={{
              width: 40,
              height: 40,
              background: "rgba(100, 200, 100, 0.4)",
              border: "2px solid #64c864",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(100, 200, 100, 0.6)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(100, 200, 100, 0.4)")}
          >
            🟢
          </button>
        </div>
      )}

      {/* Full emoji picker — all categories */}
      {showPicker && onReact && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            left: Math.max(8, Math.min(pos.x - 130, window.innerWidth - 280)),
            top: toolbarTop + 50,
            zIndex: 201,
            background: "#1a1a24",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: 12,
            padding: "0.75rem",
            width: 270,
            maxHeight: 300,
            overflowY: "auto",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {REACTION_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  margin: "0 0 0.25rem",
                  fontFamily: "'Palatino Linotype', Georgia, serif",
                }}
              >
                {cat.label}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact(emoji, selInfo.text, selInfo.pIdx);
                      clear();
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
