import { useState, useCallback, useEffect, useRef } from "react";

export type SoundTrack = "off" | "rain" | "quiet_room" | "night";

// High-quality free ambient sounds from reliable sources
const SOUND_URLS: Record<Exclude<SoundTrack, "off">, string> = {
  rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Fallback ambient
  quiet_room: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3",
  night: "https://cdn.pixabay.com/audio/2021/09/06/audio_2ccf38e3a7.mp3",
};

// Backup URLs for when primary fails
const BACKUP_URLS: Record<Exclude<SoundTrack, "off">, string> = {
  rain: "https://freepd.com/audio/Rain.mp3",
  quiet_room: "https://freepd.com/audio/Ambient.mp3",
  night: "https://freepd.com/audio/Night.mp3",
};

const TRACK_KEY = "tgwfhe_sound_track";
const VOL_KEY = "tgwfhe_sound_volume";

export function useAmbientSound() {
  const [track, setTrack] = useState<SoundTrack>("off");
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedTrack = (localStorage.getItem(TRACK_KEY) as SoundTrack) ?? "off";
    const savedVol = parseFloat(localStorage.getItem(VOL_KEY) ?? "0.3");
    setTrack(savedTrack);
    setVolume(savedVol);
  }, []);

  // Switch track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (track === "off") return;

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.volume = volume;

    // Try primary URL first
    const primaryUrl = SOUND_URLS[track];
    const backupUrl = BACKUP_URLS[track];

    audio.src = primaryUrl;
    audio.play().catch(() => {
      // If primary fails, try backup
      audio.src = backupUrl;
      audio.play().catch(() => {
        console.debug(`Could not play ambient sound: ${track}`);
      });
    });

    audioRef.current = audio;

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
    };
  }, [track]);

  // Update volume without restarting
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, volume));
  }, [volume]);

  const changeTrack = useCallback((t: SoundTrack) => {
    setTrack(t);
    localStorage.setItem(TRACK_KEY, t);
  }, []);

  const changeVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    localStorage.setItem(VOL_KEY, String(clamped));
  }, []);

  return { track, volume, changeTrack, changeVolume };
}
