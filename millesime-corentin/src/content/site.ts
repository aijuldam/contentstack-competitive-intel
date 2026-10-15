// Textes du site. Règle typographique : aucun tiret cadratin.
import type { PhotoCategory } from './photos';

const nb = String.fromCharCode(0xa0); // espace insécable

export const site = {
  title: 'Millésime Corentin : 30 ans',
  hero: {
    eyebrow: 'Cuvée spéciale',
    name: 'Corentin',
    vintage: '30 ans',
    tagline: 'Élevé à Lyon. Affiné à Paris. À déguster entre amis.',
    cta: 'Découvrir le millésime',
  },
  portrait: {
    kicker: 'Le millésime',
    title: 'Trente ans d’élevage',
    paragraphs: [
      'Né et élevé à Lyon, affiné à Paris, ce millésime a pris le temps qu’il fallait pour révéler tout son caractère.',
      'Une belle complexité, une générosité constante et une finale qui fait toujours sourire. Il se partage, il ne se garde pas pour soi.',
    ],
  },
  terroirs: {
    title: 'Les terroirs du millésime',
    intro:
      'Des attaches, des étés et des horizons. Quelques images de ce qui donne à ce millésime toute sa saveur.',
    navLabel: 'Aller à une catégorie de souvenirs',
  },
  experts: {
    title: 'L’avis des experts',
    intro: `Le jury a goûté, longuement. Voici ses conclusions${nb}:`,
    notes: [
      { term: 'Robe', text: 'Lumineuse. Un sourire qui se remarque de l’autre bout de la table.' },
      { term: 'Nez', text: 'Franc et généreux, avec une belle note d’humour.' },
      { term: 'Bouche', text: 'Ample et chaleureuse, longue en conversation.' },
      { term: 'Accords', text: 'Tablées entre amis, longues soirées, retrouvailles en famille.' },
      { term: 'Garde', text: 'Excellente. Ce millésime commence à peine à se révéler.' },
    ],
    score: '30/20',
    scoreNote: 'Le jury s’est permis une exception.',
  },
  song: {
    title: 'Le millésime se chante aussi',
    intro:
      'Une chanson pour tes trente ans. À écouter, à fredonner et à reprendre tous ensemble.',
    readLyrics: 'Lire les paroles',
    hideLyrics: 'Masquer les paroles',
    playFromStart: 'Écouter depuis le début',
    lyricsSoon: 'Les paroles arrivent bientôt',
    audioMissing: 'La musique arrive bientôt',
  },
  toast: {
    title: 'À tes trente ans, Corentin.',
    lines: [
      'Aux prochaines tablées.',
      'Aux étés à Oléron.',
      'Aux retours à Lyon.',
      'Aux nuits de Paris.',
      'Et à tout ce qu’il nous reste à fêter.',
    ],
    button: 'Lever son verre',
    question: `Qui fête ses trente ans${nb}?`,
    answer: `CORENTIN${nb}!`,
  },
  footer: `Assemblé avec amour par la famille. Édition spéciale${nb}: 30 ans.`,
};

export interface MemoryCategory {
  id: Exclude<PhotoCategory, 'portrait'>;
  numeral: string;
  title: string;
  subtitle: string;
  text: string;
  layout: 'mosaic' | 'feature' | 'left' | 'right' | 'row';
}

// Exactement trois catégories, dans l’ordre d’affichage.
export const memoryCategories: MemoryCategory[] = [
  {
    id: 'lyon-hongrie',
    numeral: 'I',
    title: 'Lyon & Hongrie',
    subtitle: 'Les attaches',
    text: 'Des lieux qui comptent, des retrouvailles et des moments à garder près de soi.',
    layout: 'mosaic',
  },
  {
    id: 'oleron',
    numeral: 'II',
    title: 'Oléron',
    subtitle: 'La douceur',
    text: 'L’été avec les parents. L’air de l’île, le temps qui ralentit et le plaisir d’être ensemble.',
    layout: 'feature',
  },
  {
    id: 'voyages',
    numeral: 'III',
    title: 'Voyages',
    subtitle: 'Les échappées',
    text: 'Changer de décor, prendre le temps et revenir avec quelques souvenirs de plus.',
    layout: 'row',
  },
];
