import { useAudio } from '../audio/AudioProvider';
import { site } from '../content/site';
import { song } from '../content/song';

const fmt = (t: number) => {
  if (!Number.isFinite(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Lecteur persistant, toujours visible en bas de page.
export function Player() {
  const { available, playing, currentTime, duration, volume, toggle, seek, setVolume } = useAudio();
  return (
    <div className="player" role="region" aria-label="Lecteur audio" data-audio-control>
      <button
        type="button"
        className="player__toggle"
        onClick={toggle}
        disabled={!available}
        aria-label={playing ? 'Mettre en pause' : 'Lancer la musique'}
      >
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
      </button>
      <div className="player__info">
        <span className="player__title">{song.title}</span>
        {available ? (
          <div className="player__progress">
            <span className="player__time">{fmt(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Position de lecture"
              disabled={!duration}
            />
            <span className="player__time">{fmt(duration)}</span>
          </div>
        ) : (
          <span className="player__missing">{site.song.audioMissing}</span>
        )}
      </div>
      <label className="player__volume">
        <span className="visually-hidden">Volume</span>
        <span aria-hidden="true">♪</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          disabled={!available}
        />
      </label>
    </div>
  );
}
