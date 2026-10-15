import { memoryCategories, site } from '../content/site';
import { type Photo } from '../content/photos';
import { scrollToSection } from '../lib/motion';
import { PhotoImage } from './PhotoImage';

interface Props {
  memories: Photo[];
  onOpen: (index: number) => void;
}

export function Terroirs({ memories, onOpen }: Props) {
  const { terroirs } = site;
  return (
    <section id="terroirs" className="section terroirs" aria-labelledby="terroirs-title">
      <header className="section-head">
        <h2 id="terroirs-title">{terroirs.title}</h2>
        <p className="section-intro">{terroirs.intro}</p>
        <nav className="terroirs__nav" aria-label={terroirs.navLabel}>
          {memoryCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="chip"
              onClick={() => scrollToSection(`terroir-${cat.id}`)}
            >
              {cat.title}
            </button>
          ))}
        </nav>
      </header>

      {memoryCategories.map((cat) => {
        const items = memories
          .map((photo, index) => ({ photo, index }))
          .filter(({ photo }) => photo.category === cat.id);
        return (
          <article
            key={cat.id}
            id={`terroir-${cat.id}`}
            className={`terroir terroir--${cat.layout}`}
            aria-labelledby={`terroir-${cat.id}-title`}
          >
            <header className="terroir__head">
              <span className="terroir__numeral" aria-hidden="true">
                {cat.numeral}
              </span>
              <p className="terroir__subtitle">{cat.subtitle}</p>
              <h3 id={`terroir-${cat.id}-title`} tabIndex={-1} data-scroll-focus>
                {cat.title}
              </h3>
              <p className="terroir__text">{cat.text}</p>
            </header>
            <div className="terroir__grid">
              {items.map(({ photo, index }) => (
                <figure key={photo.id} className="terroir__item">
                  <button
                    type="button"
                    className="photo-button"
                    onClick={() => onOpen(index)}
                    aria-label={`Agrandir : ${photo.alt}`}
                  >
                    <PhotoImage photo={photo} />
                  </button>
                  {photo.caption && <figcaption>{photo.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
