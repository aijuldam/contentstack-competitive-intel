// Configuration centralisée des dix photos.
// Déposez les fichiers dans public/photos/ en gardant exactement ces noms.
// Champs modifiables : alt (texte alternatif), caption (légende, laisser vide
// pour ne rien afficher) et position (cadrage CSS object-position, ex. 'center 30%').

export type PhotoCategory = 'portrait' | 'lyon-hongrie' | 'oleron' | 'voyages';

export interface Photo {
  id: string;
  src: string;
  category: PhotoCategory;
  alt: string;
  caption: string;
  position: string;
}

export const photos: Photo[] = [
  {
    id: 'photo-01',
    src: 'photos/photo-01.jpg',
    category: 'portrait',
    alt: 'Portrait de Corentin',
    caption: '',
    position: 'center 30%',
  },
  {
    id: 'photo-02',
    src: 'photos/photo-02.jpg',
    category: 'lyon-hongrie',
    alt: 'Souvenir de Corentin, Lyon & Hongrie, photo 1 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-03',
    src: 'photos/photo-03.jpg',
    category: 'lyon-hongrie',
    alt: 'Souvenir de Corentin, Lyon & Hongrie, photo 2 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-04',
    src: 'photos/photo-04.jpg',
    category: 'lyon-hongrie',
    alt: 'Souvenir de Corentin, Lyon & Hongrie, photo 3 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-05',
    src: 'photos/photo-05.jpg',
    category: 'oleron',
    alt: 'Souvenir de Corentin, Oléron, photo 1 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-06',
    src: 'photos/photo-06.jpg',
    category: 'oleron',
    alt: 'Souvenir de Corentin, Oléron, photo 2 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-07',
    src: 'photos/photo-07.jpg',
    category: 'oleron',
    alt: 'Souvenir de Corentin, Oléron, photo 3 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-08',
    src: 'photos/photo-08.jpg',
    category: 'voyages',
    alt: 'Souvenir de Corentin, Voyages, photo 1 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-09',
    src: 'photos/photo-09.jpg',
    category: 'voyages',
    alt: 'Souvenir de Corentin, Voyages, photo 2 sur 3',
    caption: '',
    position: 'center',
  },
  {
    id: 'photo-10',
    src: 'photos/photo-10.jpg',
    category: 'voyages',
    alt: 'Souvenir de Corentin, Voyages, photo 3 sur 3',
    caption: '',
    position: 'center',
  },
];

export const photoUrl = (photo: Photo) => `${import.meta.env.BASE_URL}${photo.src}`;
