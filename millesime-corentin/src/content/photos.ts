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

  // Oléron : 7 photos, dans l’ordre.
  photo('oleron-01', 'oleron', 'Corentin tout petit sur la plage, lunettes de soleil et seau à la main', 'center 30%'),
  photo('oleron-02', 'oleron', 'Corentin tout petit sur le sable, en veste en jean et lunettes de soleil', 'center 30%'),
  photo('oleron-03', 'oleron', 'Corentin enfant dans les dunes, un ballon dans les bras', '60% 40%'),
  photo('oleron-04', 'oleron', 'Corentin adolescent sur la plage, l’air songeur', '60% 40%'),
  photo('oleron-05', 'oleron', 'Corentin adolescent perché sur un poteau en bois, au bord des dunes', '40% 50%'),
  photo('oleron-06', 'oleron', 'Corentin sur la plage, casquette à l’envers et sac sur l’épaule', 'center 15%'),
  photo('oleron-07', 'oleron', 'Corentin souriant devant des cabanes colorées et des bateaux à marée basse', '70% 50%'),

  // Voyages : 6 photos, dans l’ordre.
  photo('voyages-01', 'voyages', 'Corentin adolescent, coiffé d’un chapeau de paille, tenant un bébé crocodile', 'center 30%'),
  photo('voyages-02', 'voyages', 'Corentin souriant sur un bateau, devant la statue de la Liberté à New York', '65% 50%'),
  photo('voyages-03', 'voyages', 'Corentin debout sur le dos d’un grand lion de bronze, à Londres', '70% 35%'),
  photo('voyages-04', 'voyages', 'Trois amis souriants au milieu d’une foule, en plein air', 'center 35%'),
  photo('voyages-05', 'voyages', 'Corentin devant un château en ruine au bord des falaises, face à la mer', '75% 40%'),
  photo('voyages-06', 'voyages', 'Corentin en chapeau conique, devant un paysage de volcans au lever du jour', '65% 40%'),
];

export const photoUrl = (p: Photo) => `${import.meta.env.BASE_URL}${p.src}`;
