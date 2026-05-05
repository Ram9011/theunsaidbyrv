"use client";

import { chapters } from "@/src/data/chapters";
import { useParams } from "next/navigation";

export default function ReadPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const ch = chapters.find((c) => c.id === chapterId);

  if (!ch) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Chapter not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The chapter you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Import the actual ReadingPageComponent dynamically to keep this file lightweight
  // For now, render a placeholder - the actual implementation will follow
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "2rem",
          marginBottom: "1rem",
        }}
      >
        {ch.title}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Reading page loading...</p>
      <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
        Chapter ID: {chapterId} | Found: {ch.title}
      </p>
    </div>
  );
}
