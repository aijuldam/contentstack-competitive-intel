import { site } from '../content/site';
import { scrollToSection } from '../lib/motion';

export function Hero() {
  const { hero } = site;
  return (
    <header className="hero">
      <div className="label">
        <p className="label__eyebrow">{hero.eyebrow}</p>
        <p className="label__mill">Millésime</p>
        <h1 className="label__name">{hero.name}</h1>
        <p className="label__vintage">{hero.vintage}</p>
        <span className="label__rule" aria-hidden="true" />
        <p className="label__tagline">{hero.tagline}</p>
      </div>
      <button type="button" className="btn btn--ghost hero__cta" onClick={() => scrollToSection('portrait')}>
        {hero.cta}
      </button>
    </header>
  );
}
