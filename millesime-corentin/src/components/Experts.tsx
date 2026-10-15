import { site } from '../content/site';

export function Experts() {
  const { experts } = site;
  return (
    <section id="experts" className="section experts" aria-labelledby="experts-title">
      <header className="section-head">
        <h2 id="experts-title">{experts.title}</h2>
        <p className="section-intro">{experts.intro}</p>
      </header>
      <div className="tasting">
        <dl className="tasting__notes">
          {experts.notes.map((note) => (
            <div key={note.term} className="tasting__row">
              <dt>{note.term}</dt>
              <dd>{note.text}</dd>
            </div>
          ))}
        </dl>
        <div className="tasting__score">
          <span className="tasting__value">{experts.score}</span>
          <span className="tasting__caption">{experts.scoreNote}</span>
        </div>
      </div>
    </section>
  );
}
