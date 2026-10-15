import { photos } from '../content/photos';
import { site } from '../content/site';
import { PhotoImage } from './PhotoImage';

export function Portrait() {
  const portrait = photos.find((p) => p.category === 'portrait')!;
  const { portrait: text } = site;
  return (
    <section id="portrait" className="section portrait" aria-labelledby="portrait-title">
      <figure className="portrait__photo">
        <PhotoImage photo={portrait} eager />
        {portrait.caption && <figcaption>{portrait.caption}</figcaption>}
      </figure>
      <div className="portrait__text">
        <p className="kicker">{text.kicker}</p>
        <h2 id="portrait-title" tabIndex={-1} data-scroll-focus>
          {text.title}
        </h2>
        {text.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
