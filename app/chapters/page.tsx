"use client";

import { motion, useReducedMotion } from "framer-motion";
import { chapters, partTitles } from "@/src/data/chapters";
import { useState, useEffect } from "react";
import { useTheme } from "@/src/hooks/useTheme";
import Link from "next/link";

export default function ChaptersPage() {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const dur = reduceMotion ? 0 : 0.5;
  const ease = [0.22, 1, 0.36, 1] as const;

  const [readProgress, setReadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const progress: Record<string, number> = {};
    chapters.forEach((ch) => {
      const saved = localStorage.getItem(`reading-progress-${ch.id}`);
      if (saved) progress[ch.id] = Number(saved);
    });
    setReadProgress(progress);
  }, []);

  let lastPart = -1;

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        transition: "background 0.4s, color 0.4s",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <Link href="/" style={{ display: "inline-flex", textDecoration: "none" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "'Palatino Linotype', Georgia, serif",
              marginBottom: "2rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.color = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget instanceof HTMLElement)
                e.currentTarget.style.color = "var(--muted)";
            }}
          >
            ← Back to Cover
          </button>
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "2.5rem",
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: "0.5rem",
            color: "var(--fg)",
          }}
        >
          Contents
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur, ease, delay: 0.1 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "var(--muted)",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          A story in five parts. Each chapter builds toward a truth — that love doesn't disappear,
          it just learns to exist differently.
        </motion.p>

        {/* Chapters grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur, ease, delay: 0.2 }}
        >
          {chapters.map((ch, idx) => {
            const showPart = ch.part !== lastPart;
            lastPart = ch.part;
            const progress = readProgress[ch.id] ?? 0;

            return (
              <div key={ch.id}>
                {showPart && (
                  <div
                    style={{
                      fontFamily: "'Palatino Linotype', Georgia, serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.5)",
                      marginTop: "2.5rem",
                      marginBottom: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    {partTitles[ch.part] ?? `Part ${ch.part}`} · {ch.partTitle}
                  </div>
                )}

                <Link href={`/read/${ch.id}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    style={{
                      padding: "0.75rem 1rem",
                      marginBottom: "0.5rem",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201,168,76,0.1)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                        e.currentTarget.style.background = "rgba(201,168,76,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        fontFamily: "'Palatino Linotype', Georgia, serif",
                      }}
                    >
                      <span style={{ fontSize: "0.95rem", color: "var(--fg)" }}>
                        {ch.chapterNumber === 0
                          ? "Prologue"
                          : ch.chapterNumber === 14
                            ? "Epilogue"
                            : `${ch.chapterNumber}. ${ch.title}`}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                        {progress ? `${Math.round(progress)}%` : ""}
                      </span>
                    </div>

                    {progress > 0 && (
                      <div
                        style={{
                          height: "3px",
                          background: "rgba(201,168,76,0.1)",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          style={{
                            height: "100%",
                            background: "rgba(201,168,76,0.6)",
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
