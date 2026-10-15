import { useCallback, useEffect, useRef } from 'react';
import type { Photo } from '../content/photos';
import { memoryCategories } from '../content/site';
import { PhotoImage } from './PhotoImage';

interface Props {
  photos: Photo[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

// Visionneuse de toutes les photos de souvenirs, dans l’ordre des catégories.
// N’agit jamais sur la musique.
export function Lightbox({ photos, index, onChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  const photo = index !== null ? photos[index] : null;
  const category = photo ? memoryCategories.find((c) => c.id === photo.category) : null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Visionneuse de photos"
      onClose={() => {
        onClose();
        returnFocus.current?.focus();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
    >
      {photo && (
        <div className="lightbox__inner">
          <button type="button" className="lightbox__close" onClick={() => dialogRef.current?.close()} aria-label="Fermer">
            ×
          </button>
          <figure className="lightbox__figure">
            <div className="lightbox__media">
              <PhotoImage key={photo.id} photo={photo} eager />
            </div>
            <figcaption className="lightbox__caption">
              <span className="lightbox__category">{category?.title}</span>
              {photo.caption && <span className="lightbox__text">{photo.caption}</span>}
              <span className="lightbox__count" aria-live="polite">
                {(index ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Photo précédente">
            ‹
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Photo suivante">
            ›
          </button>
        </div>
      )}
    </dialog>
  );
}
