"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { chapters } from "@/src/data/chapters";
import { useEffect, useState } from "react";
import Link from "next/link";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: 8 + Math.floor(Math.random() * 84),
  top: 8 + Math.floor(Math.random() * 84),
  dur: 3.5 + (i % 4) * 0.7,
  delay: (i % 6) * 0.5,
  op: 0.2 + (i % 3) * 0.1,
  size: 2 + (i % 3),
}));

export default function CoverPage() {
  const router = useRouter();
  const [lastChapter, setLastChapter] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof sessionStorage !== "undefined") {
      return !sessionStorage.getItem("tgwfhe_intro_seen");
    }
    return true;
  });
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "Welcome to a story that starts with forgotten earrings and ends with a love that rewrote forever.",
    "Some moments arrive quietly. Some people do too. This is about both.",
    "You're about to read the story of Aarav and Palak — a love letter written in silence and grief.",
    "The best stories teach us not how to live, but how to remember what it means to have truly loved.",
    "Before you begin: breathe. Make yourself comfortable. Some stories demand of you that you sit with them.",
    "This is the tale of a man who kept the small things she forgot, and lost the one thing he couldn't hold onto.",
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (showIntro) {
      // Switch greetings every 800ms
      const greetingInterval = setInterval(() => {
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
      }, 800);

      const hideIntro = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("tgwfhe_intro_seen", "true");
      }, 5500);

      return () => {
        clearInterval(greetingInterval);
        clearTimeout(hideIntro);
      };
    }
  }, [showIntro]);

  useEffect(() => {
    const s = localStorage.getItem("tgwfhe_currentChapter");
    if (s) setLastChapter(s);
  }, []);

  const resume = () => {
    if (lastChapter) {
      router.push(`/read/${lastChapter}`);
    }
  };

  const lastCh = lastChapter ? chapters.find((c) => c.id === lastChapter) : null;

  return (
    <div
      className="cover-page"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                lineHeight: 1.8,
                color: "var(--fg)",
                textAlign: "center",
                maxWidth: "600px",
                fontStyle: "italic",
                opacity: 0.85,
              }}
            >
              {greetings[greetingIndex]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold particles */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="gold-particle"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animation: `particle-float ${p.dur}s ${p.delay}s ease-in-out infinite`,
              "--op": p.op,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Cover Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          maxWidth: "640px",
          aspectRatio: "3 / 4.5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(18, 21, 34, 0.6)",
          border: "1.5px solid rgba(201, 168, 76, 0.25)",
          borderRadius: "16px",
          padding: "0.75rem 0.2rem",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(201, 169, 110, 0.1), inset 0 0 30px rgba(201, 169, 110, 0.08)",
          transition: "all 0.3s ease",
        }}
        whileHover={{
          boxShadow:
            "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(201, 169, 110, 0.15), inset 0 0 40px rgba(201, 169, 110, 0.12)",
        }}
      >
        <img
          src="/images/coverpage.png"
          alt="The Girl Who Forgot Her Earrings"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
            borderRadius: "12px",
          }}
        />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{
          flexShrink: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {lastCh ? (
          <button className="cover-begin-btn" onClick={resume}>
            Continue Reading
          </button>
        ) : (
          <Link href={`/read/${chapters[0].id}`}>
            <button className="cover-begin-btn">Begin Reading</button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
