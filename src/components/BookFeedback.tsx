import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackData {
  rating: number; // 1–5 stars
  emotion: string; // one-word feeling
  wouldRecommend: boolean | null;
  openText: string;
  favoriteQuote: string;
}

const EMOTION_OPTIONS = [
  { emoji: "🥹", label: "Moved" },
  { emoji: "💔", label: "Heartbroken" },
  { emoji: "🌧", label: "Melancholic" },
  { emoji: "🤍", label: "At peace" },
  { emoji: "😭", label: "Cried" },
  { emoji: "✨", label: "Inspired" },
  { emoji: "🫂", label: "Held" },
  { emoji: "🌙", label: "Reflective" },
];

const STORAGE_KEY = "tgwfhe_feedback";

function saveFeedback(data: FeedbackData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, submittedAt: Date.now() }));
}

export function BookFeedback() {
  const already = !!localStorage.getItem(STORAGE_KEY);

  const [step, setStep] = useState<"idle" | "rating" | "emotion" | "text" | "done">(
    already ? "done" : "idle",
  );
  const [data, setData] = useState<FeedbackData>({
    rating: 0,
    emotion: "",
    wouldRecommend: null,
    openText: "",
    favoriteQuote: "",
  });

  const update = (patch: Partial<FeedbackData>) => setData((d) => ({ ...d, ...patch }));

  const submit = useCallback(() => {
    saveFeedback(data);
    setStep("done");
  }, [data]);

  return (
    <div
      style={{
        padding: "4rem 1.5rem 6rem",
        maxWidth: 560,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Decorative rule */}
      <div
        style={{
          width: 60,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)",
          margin: "0 auto 2.5rem",
        }}
      />

      <p
        style={{
          fontFamily: "'Palatino Linotype', Georgia, serif",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.6)",
          marginBottom: "0.75rem",
        }}
      >
        you reached the end
      </p>

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.5rem",
          color: "var(--fg)",
          marginBottom: "0.5rem",
        }}
      >
        How did it leave you?
      </h2>

      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontSize: "0.85rem",
          color: "var(--muted)",
          marginBottom: "2.5rem",
          lineHeight: 1.7,
        }}
      >
        Your words matter to the author.
      </p>

      <AnimatePresence mode="wait">
        {/* ─── IDLE ─── */}
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setStep("rating")}
              className="cover-begin-btn"
              style={{ margin: "0 auto" }}
            >
              Leave a note for Raj
            </button>
          </motion.div>
        )}

        {/* ─── STEP 1: STAR RATING ─── */}
        {step === "rating" && (
          <motion.div
            key="rating"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "1.25rem",
              }}
            >
              Rate the book
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => update({ rating: n })}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.8rem",
                    opacity: n <= data.rating ? 1 : 0.25,
                    transition: "opacity 0.15s, transform 0.15s",
                    transform: n <= data.rating ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>

            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "0.75rem",
              }}
            >
              Would you recommend it?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { label: "Yes, absolutely", val: true },
                { label: "Maybe", val: false },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  onClick={() => update({ wouldRecommend: opt.val })}
                  style={{
                    padding: "0.4rem 1.1rem",
                    borderRadius: "999px",
                    border: `1px solid ${data.wouldRecommend === opt.val ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)"}`,
                    background: data.wouldRecommend === opt.val ? "rgba(201,168,76,0.1)" : "none",
                    color: data.wouldRecommend === opt.val ? "#c9a84c" : "var(--muted)",
                    fontFamily: "'Palatino Linotype', Georgia, serif",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("emotion")}
              disabled={!data.rating}
              className="cover-begin-btn"
              style={{ margin: "0 auto", opacity: data.rating ? 1 : 0.4 }}
            >
              Continue →
            </button>
          </motion.div>
        )}

        {/* ─── STEP 2: EMOTION ─── */}
        {step === "emotion" && (
          <motion.div
            key="emotion"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "1.25rem",
              }}
            >
              How does it leave you feeling?
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              {EMOTION_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => update({ emotion: opt.label })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.4rem 0.9rem",
                    borderRadius: "999px",
                    border: `1px solid ${data.emotion === opt.label ? "rgba(214,165,178,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: data.emotion === opt.label ? "rgba(214,165,178,0.1)" : "none",
                    color: data.emotion === opt.label ? "#D6A5B2" : "var(--muted)",
                    fontFamily: "'Palatino Linotype', Georgia, serif",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("text")}
              disabled={!data.emotion}
              className="cover-begin-btn"
              style={{ margin: "0 auto", opacity: data.emotion ? 1 : 0.4 }}
            >
              Continue →
            </button>
          </motion.div>
        )}

        {/* ─── STEP 3: OPEN TEXT ─── */}
        {step === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "0.75rem",
              }}
            >
              A line you want to tell the author?
            </p>
            <textarea
              value={data.openText}
              onChange={(e) => update({ openText: e.target.value })}
              placeholder="Write anything — honestly…"
              rows={4}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "0.85rem 1rem",
                color: "var(--fg)",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.88rem",
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            />

            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}
            >
              A line that stayed with you? (optional)
            </p>
            <textarea
              value={data.favoriteQuote}
              onChange={(e) => update({ favoriteQuote: e.target.value })}
              placeholder='"..."'
              rows={2}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                color: "var(--fg)",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                marginBottom: "1.5rem",
                boxSizing: "border-box",
              }}
            />

            <button onClick={submit} className="cover-begin-btn" style={{ margin: "0 auto" }}>
              Send to Raj ✦
            </button>
          </motion.div>
        )}

        {/* ─── DONE ─── */}
        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌙</div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "var(--fg)",
                lineHeight: 1.8,
                marginBottom: "0.5rem",
              }}
            >
              Thank you for reading.
            </p>
            <p
              style={{
                fontFamily: "'Palatino Linotype', Georgia, serif",
                fontSize: "0.75rem",
                color: "var(--muted)",
                letterSpacing: "0.1em",
                marginBottom: "2rem",
              }}
            >
              — Raj Vishwakarma
            </p>

            {/* Social links */}
            <p
              style={{
                fontFamily: "'Palatino Linotype', Georgia, serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.5)",
                marginBottom: "0.75rem",
              }}
            >
              follow the author
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.4rem",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Instagram",
                  icon: "📸",
                  url: "https://www.instagram.com/raajkibatein?igsh=MXBxaHZxeGRnNWZrMQ==",
                },
                {
                  label: "Facebook",
                  icon: "📘",
                  url: "https://www.facebook.com/profile.php?id=61586723681789",
                },
                {
                  label: "LinkedIn",
                  icon: "💼",
                  url: "https://www.linkedin.com/in/ram-sanehi-437707282/",
                },
                { label: "X (Twitter)", icon: "𝕏", url: "https://x.com/Vishwakarm4095" },
                { label: "Medium", icon: "✍️", url: "https://medium.com/@vish6933" },
                {
                  label: "YouTube",
                  icon: "▶️",
                  url: "https://youtube.com/@raajkibatein_rv?si=282ntPgDKi2C4AQc",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    color: "var(--muted)",
                    fontFamily: "'Palatino Linotype', Georgia, serif",
                    fontSize: "0.72rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
                    e.currentTarget.style.color = "#c9a84c";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "var(--muted)";
                  }}
                >
                  <span style={{ fontSize: "0.85rem" }}>{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
