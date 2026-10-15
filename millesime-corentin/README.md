# Millésime Corentin : 30 ans

Un petit site d’anniversaire, façon étiquette de grand cru, pour les trente ans de Corentin.
« Élevé à Lyon. Affiné à Paris. À déguster entre amis. »

## Lancer le site

```bash
npm install
npm run dev      # aperçu local
npm run build    # vérifications + build dans dist/
```

`npm run build` lance d’abord `npm run check`, qui vérifie :

- qu’il n’y a aucun tiret cadratin dans les textes, la configuration et ce README ;
- qu’il y a exactement dix photos (un portrait et trois groupes de trois) ;
- que les catégories sont exactement « Lyon & Hongrie », « Oléron » et « Voyages ».

## Organisation de la page

1. Ouverture (l’étiquette du millésime).
2. Portrait (photo 01).
3. Les terroirs du millésime : trois catégories de souvenirs, avec des boutons
   qui font défiler la page jusqu’à chacune.
4. L’avis des experts.
5. Le millésime se chante aussi (pochette, paroles, écoute).
6. Le toast final.

Un lecteur audio persistant reste en bas de l’écran. Il n’existe qu’un seul
élément audio : le bouton « Écouter depuis le début » pilote la même piste.

## Photos

Déposez les fichiers dans `public/photos/` avec exactement ces noms :

| Fichier | Emplacement |
| --- | --- |
| `photo-01.jpg` | Portrait (après l’ouverture) |
| `photo-02.jpg`, `photo-03.jpg`, `photo-04.jpg` | Lyon & Hongrie |
| `photo-05.jpg`, `photo-06.jpg`, `photo-07.jpg` | Oléron |
| `photo-08.jpg`, `photo-09.jpg`, `photo-10.jpg` | Voyages |

Tant qu’un fichier manque, un placeholder élégant s’affiche à sa place.

Les textes alternatifs, légendes et cadrages se modifient dans
`src/content/photos.ts` (champs `alt`, `caption` et `position`).
Une légende vide n’affiche rien. Les neuf souvenirs s’ouvrent dans une
visionneuse qui affiche la catégorie et la légende.

## Musique

Déposez la chanson dans `public/audio/chanson-corentin.mp3`
(le chemin se change dans `src/content/song.ts`, champ `audioSrc`).
Si le fichier est absent, les boutons de lecture sont désactivés.

## Modifier les paroles

Les paroles sont dans **`src/content/song.ts`**, champ `lyrics` :

```ts
export const song = {
  title: 'La chanson de Corentin',
  audioSrc: 'audio/chanson-corentin.mp3',
  lyrics: `[Verse 1]
Première ligne
Deuxième ligne

[Chorus]
...`,
};
```

- Collez les paroles exactes entre les deux accents graves.
- Gardez une ligne vide entre les couplets.
- Les repères Suno sont affichés en français : `[Verse 1]` devient « Couplet 1 »,
  `[Chorus]` « Refrain », `[Bridge]` « Pont », `[Outro]` « Final ».
  Les paroles chantées ne sont pas modifiées.
- Un éventuel tiret cadratin dans les paroles est remplacé à l’affichage par une virgule.
- Tant que `lyrics` est vide, le site affiche « Les paroles arrivent bientôt ».

## Textes

Tous les autres textes (ouverture, catégories, avis des experts, toast,
pied de page) sont dans `src/content/site.ts`.
