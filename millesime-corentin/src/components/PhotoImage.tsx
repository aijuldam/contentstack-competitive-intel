import { useState } from 'react';
import { photoUrl, type Photo } from '../content/photos';

// Affiche la photo, ou un placeholder élégant si le fichier n’est pas encore présent.
export function PhotoImage({ photo, eager = false }: { photo: Photo; eager?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const number = photo.id.replace('photo-', '');
    return (
      <span className="photo-placeholder" role="img" aria-label={photo.alt}>
        <span className="photo-placeholder__mark" aria-hidden="true">✦</span>
        <span className="photo-placeholder__label" aria-hidden="true">Photo {number}</span>
        <span className="photo-placeholder__hint" aria-hidden="true">Bientôt dans la cave</span>
      </span>
    );
  }

  return (
    <img
      src={photoUrl(photo)}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectPosition: photo.position }}
      onError={() => setFailed(true)}
    />
  );
}
