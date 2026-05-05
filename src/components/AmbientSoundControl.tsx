import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientSound, type SoundTrack } from "../hooks/useAmbientSound";

const TRACKS: { id: SoundTrack; label: string; icon: string }[] = [
  { id: "off", label: "Silence", icon: "○" },
  { id: "rain", label: "Rain", icon: "🌧" },
  { id: "quiet_room", label: "Quiet Room", icon: "◻" },
  { id: "night", label: "Night", icon: "🌙" },
];

export function AmbientSoundControl() {
  const { track, volume, changeTrack, changeVolume } = useAmbientSound();
  const [open, setOpen] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<SoundTrack | null>(null);

  return (
    <div style={{ position: "fixed", bottom: "5rem", left: "1rem", zIndex: 60 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              marginBottom: "0.75rem",
              background: "var(--surface)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "12px",
              padding: "1rem",
              width: "180px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Label */}
            <p
              style={{
                fontFamily: "'Palatino Linotype', Georgia, serif",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.75rem",
              }}
            >
              Ambient Sound
            </p>

            {/* Track buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTrack(t.id)}
                  onMouseEnter={() => setHoveredTrack(t.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    width: "100%",
                    padding: "0.5rem 0.6rem",
                    background:
                      track === t.id
                        ? "rgba(201,168,76,0.15)"
                        : hoveredTrack === t.id
                          ? "rgba(201,168,76,0.08)"
                          : "rgba(255,255,255,0.02)",
                    border: `1px solid ${track === t.id ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.1)"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: track === t.id ? "#c9a84c" : "var(--muted)",
                    fontFamily: "'Palatino Linotype', Georgia, serif",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                  }}
                  title={t.label}
                >
                  <span style={{ fontSize: "1.1rem", minWidth: "24px", textAlign: "center" }}>
                    {t.icon}
                  </span>
                  <span style={{ flex: 1, textAlign: "left" }}>{t.label}</span>
                  {track === t.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontSize: "0.9rem", color: "#c9a84c" }}
                    >
                      ✓
                    </motion.span>
                  )}
                </button>
              ))}
            </div>

            {/* Volume control - only show if track is active */}
            {track !== "off" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginTop: "0.75rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Palatino Linotype', Georgia, serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Volume
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(volume * 100)}
                    onChange={(e) => changeVolume(parseInt(e.target.value) / 100)}
                    style={{
                      flex: 1,
                      height: "4px",
                      borderRadius: "2px",
                      background: "rgba(201,168,76,0.2)",
                      outline: "none",
                      accentColor: "#c9a84c",
                      cursor: "pointer",
                    }}
                    title="Adjust volume"
                  />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#c9a84c",
                      minWidth: "28px",
                      textAlign: "right",
                      fontFamily: "monospace",
                    }}
                  >
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        title={track === "off" ? "Enable Ambient Sound" : `Volume: ${Math.round(volume * 100)}%`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: track !== "off" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${track !== "off" ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
          color: track !== "off" ? "#c9a84c" : "var(--muted)",
          fontSize: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        {track === "rain" ? "🌧" : track === "night" ? "🌙" : track === "quiet_room" ? "◻" : "♪"}
      </motion.button>
    </div>
  );
}
