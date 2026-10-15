import { useMemo, useState } from 'react';
import { useAudio } from '../audio/AudioProvider';
import { site } from '../content/site';
import { song } from '../content/song';
import { parseLyrics } from '../lib/lyrics';

export function Song() {
  const { song: text } = site;
  const { available, playFromStart } = useAudio();
  const [open, setOpen] = useState(false);
  const stanzas = useMemo(() => parseLyrics(song.lyrics), []);

  return (
    <section id="chanson" className="section song" aria-labelledby="song-title">
      <header className="section-head">
        <h2 id="song-title">{text.title}</h2>
        <p className="section-intro">{text.intro}</p>
      </header>

      <div className="sleeve">
        <div className="sleeve__vinyl" aria-hidden="true">
          <span className="sleeve__label">30</span>
        </div>
        <div className="sleeve__body">
          <p className="kicker">Face A</p>
          <h3 className="sleeve__title">{song.title}</h3>
          <div className="sleeve__actions">
            <button
              type="button"
              className="btn"
              aria-expanded={open}
              aria-controls="song-lyrics"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? text.hideLyrics : text.readLyrics}
            </button>
            <button type="button" className="btn btn--ghost" onClick={playFromStart} disabled={!available}>
              {text.playFromStart}
            </button>
          </div>
          {!available && <p className="sleeve__note">{text.audioMissing}</p>}
        </div>
      </div>

      <div id="song-lyrics" className="lyrics" hidden={!open}>
        {stanzas.length === 0 ? (
          <p className="lyrics__soon">{text.lyricsSoon}</p>
        ) : (
          stanzas.map((stanza, i) => (
            <div key={i} className="lyrics__stanza">
              {stanza.heading && <h4 className="lyrics__heading">{stanza.heading}</h4>}
              {stanza.lines.length > 0 && (
                <p>
                  {stanza.lines.map((line, j) => (
                    <span key={j} className="lyrics__line">
                      {line}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
