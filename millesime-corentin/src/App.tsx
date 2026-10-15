import { useMemo, useState } from 'react';
import { AudioProvider } from './audio/AudioProvider';
import { Experts } from './components/Experts';
import { Hero } from './components/Hero';
import { Lightbox } from './components/Lightbox';
import { Player } from './components/Player';
import { Portrait } from './components/Portrait';
import { Song } from './components/Song';
import { Terroirs } from './components/Terroirs';
import { Toast } from './components/Toast';
import { photos } from './content/photos';
import { memoryCategories, site } from './content/site';

export default function App() {
  // Les souvenirs, triés dans l’ordre des catégories.
  const memories = useMemo(
    () => memoryCategories.flatMap((cat) => photos.filter((p) => p.category === cat.id)),
    [],
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <AudioProvider>
      <Hero />
      <main>
        <Portrait />
        <Terroirs memories={memories} onOpen={setLightboxIndex} />
        <Experts />
        <Song />
        <Toast />
      </main>
      <footer className="footer">{site.footer}</footer>
      <Lightbox
        photos={memories}
        index={lightboxIndex}
        onChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
      <Player />
    </AudioProvider>
  );
}
