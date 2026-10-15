import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { song } from '../content/song';

// Un seul élément <audio> pour tout le site : le lecteur persistant et le
// bouton « Écouter depuis le début » pilotent cette même piste.

type Status = 'loading' | 'ready' | 'missing';

interface AudioApi {
  status: Status;
  available: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  toggle: () => void;
  playFromStart: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const AudioCtx = createContext<AudioApi | null>(null);

export const audioUrl = `${import.meta.env.BASE_URL}${song.audioSrc}`;

export function AudioProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  // Vérifie la présence du fichier sans attendre le préchargement
  // (certains navigateurs mobiles ne chargent rien avant un geste).
  useEffect(() => {
    let cancelled = false;
    fetch(audioUrl, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') ?? '';
        // Seul un 404 ou une page HTML à la place du MP3 signale un fichier absent.
        // Un hébergeur qui refuse HEAD ne doit pas désactiver la lecture : l’élément
        // <audio> signalera lui-même une vraie erreur de chargement.
        if (!cancelled && (res.status === 404 || type.includes('text/html'))) setStatus('missing');
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const available = status !== 'missing';

  const toggle = useCallback(() => {
    const audio = ref.current;
    if (!audio || !available) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [available]);

  const playFromStart = useCallback(() => {
    const audio = ref.current;
    if (!audio || !available) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [available]);

  const seek = useCallback((time: number) => {
    const audio = ref.current;
    if (audio) audio.currentTime = time;
  }, []);

  const setVolume = useCallback((value: number) => {
    const audio = ref.current;
    if (audio) audio.volume = Math.min(1, Math.max(0, value));
  }, []);

  return (
    <AudioCtx.Provider
      value={{ status, available, playing, currentTime, duration, volume, toggle, playFromStart, seek, setVolume }}
    >
      {children}
      <audio
        ref={ref}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setStatus('ready');
          setDuration(e.currentTarget.duration || 0);
        }}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onError={() => setStatus('missing')}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onVolumeChange={(e) => setVolumeState(e.currentTarget.volume)}
      />
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio doit être utilisé dans AudioProvider');
  return ctx;
}
