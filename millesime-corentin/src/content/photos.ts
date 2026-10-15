// Configuration centralisée des photos.
// Déposez les fichiers dans public/photos/ en gardant exactement ces noms.
// Champs modifiables : alt (texte alternatif), caption (légende, laisser vide
// pour ne rien afficher) et position (cadrage CSS object-position, ex. 'center 30%').
// L’ordre de ce tableau est l’ordre d’affichage dans chaque catégorie.

export type PhotoCategory = 'portrait' | 'lyon-hongrie' | 'oleron' | 'voyages';

export interface Photo {
  id: string;
  src: string;
  category: PhotoCategory;
  alt: string;
  caption: string;
  position: string;
}

const photo = (
  id: string,
  category: PhotoCategory,
  alt: string,
  position = 'center',
  caption = '',
): Photo => ({ id, src: `photos/${id}.jpg`, category, alt, caption, position });

export const photos: Photo[] = [
  // Portrait, juste après l’ouverture.
  photo('portrait', 'portrait', 'Corentin tenant une bouteille de champagne', 'center 25%'),

  // Lyon & Hongrie : 15 photos, dans l’ordre.
  photo('lyon-hongrie-01', 'lyon-hongrie', 'Corentin bébé, assis dans l’herbe contre un gros chien', 'center 55%'),
  photo('lyon-hongrie-02', 'lyon-hongrie', 'Corentin petit, en pull rouge, éclatant de rire', 'center 30%'),
  photo('lyon-hongrie-03', 'lyon-hongrie', 'Deux enfants serrés l’un contre l’autre', '55% 35%'),
  photo('lyon-hongrie-04', 'lyon-hongrie', 'Deux enfants déguisés au pied d’un escalier, l’un coiffé d’un chapeau de paille', 'center 40%'),
  photo('lyon-hongrie-05', 'lyon-hongrie', 'Corentin enfant, maquillé et déguisé en souris', 'center 45%'),
  photo('lyon-hongrie-06', 'lyon-hongrie', 'Deux garçons côte à côte devant un vaisselier', 'center 30%'),
  photo('lyon-hongrie-07', 'lyon-hongrie', 'Corentin enfant près du sapin de Noël, faisant le signe de la victoire', '40% 50%'),
  photo('lyon-hongrie-08', 'lyon-hongrie', 'Corentin enfant assis sur une marche à côté d’un homme aux cheveux gris', 'center 30%'),
  photo('lyon-hongrie-09', 'lyon-hongrie', 'Une descente en luge dans la neige, à trois', 'center 40%'),
  photo('lyon-hongrie-10', 'lyon-hongrie', 'Corentin enfant tenant un chat noir et blanc dans ses bras', 'center 35%'),
  photo('lyon-hongrie-11', 'lyon-hongrie', 'Corentin à 14 ans, devant son gâteau d’anniversaire', '60% 45%'),
  photo('lyon-hongrie-12', 'lyon-hongrie', 'Corentin souriant, une flûte à la main', 'center 25%'),
  photo('lyon-hongrie-13', 'lyon-hongrie', 'Corentin allongé sur un tapis, câlinant un chat noir et blanc', '40% 40%'),
  photo('lyon-hongrie-14', 'lyon-hongrie', 'Corentin tenant une bouteille de champagne', 'center 30%'),
  photo('lyon-hongrie-15', 'lyon-hongrie', 'Corentin tenant un nouveau-né dans ses bras', 'center 40%'),

  // Oléron : 3 emplacements.
  photo('oleron-01', 'oleron', 'Souvenir de Corentin, Oléron, photo 1 sur 3'),
  photo('oleron-02', 'oleron', 'Souvenir de Corentin, Oléron, photo 2 sur 3'),
  photo('oleron-03', 'oleron', 'Souvenir de Corentin, Oléron, photo 3 sur 3'),

  // Voyages : 3 emplacements.
  photo('voyages-01', 'voyages', 'Souvenir de Corentin, Voyages, photo 1 sur 3'),
  photo('voyages-02', 'voyages', 'Souvenir de Corentin, Voyages, photo 2 sur 3'),
  photo('voyages-03', 'voyages', 'Souvenir de Corentin, Voyages, photo 3 sur 3'),
];

export const photoUrl = (p: Photo) => `${import.meta.env.BASE_URL}${p.src}`;
