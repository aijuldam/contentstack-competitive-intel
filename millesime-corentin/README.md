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
- la répartition des photos (1 portrait, 15 Lyon & Hongrie, 7 Oléron, 3 Voyages) ;
- que les catégories sont exactement « Lyon & Hongrie », « Oléron » et « Voyages ».

## Organisation de la page

1. Ouverture (l’étiquette du millésime).
2. Portrait.
3. Les terroirs du millésime : trois catégories de souvenirs, avec des boutons
   qui font défiler la page jusqu’à chacune.
4. L’avis des experts.
5. Le millésime se chante aussi (pochette, paroles, écoute).
6. Le toast final.

Un lecteur audio persistant reste en bas de l’écran. Il n’existe qu’un seul
élément audio : le bouton « Écouter depuis le début » pilote la même piste.

## Photos

Les fichiers sont dans `public/photos/` :

| Fichier | Emplacement |
| --- | --- |
| `portrait.jpg` | Portrait (après l’ouverture) |
| `lyon-hongrie-01.jpg` à `lyon-hongrie-15.jpg` | Lyon & Hongrie (15 photos, dans l’ordre) |
| `oleron-01.jpg` à `oleron-07.jpg` | Oléron (7 photos, dans l’ordre) |
| `voyages-01.jpg` à `voyages-03.jpg` | Voyages (à fournir) |

Tant qu’un fichier manque, un placeholder élégant s’affiche à sa place.
Pour un rendu léger, redimensionnez les photos à 1600 px de côté maximum.

Les textes alternatifs, légendes et cadrages se modifient dans
`src/content/photos.ts` (champs `alt`, `caption` et `position`).
L’ordre du tableau est l’ordre d’affichage. Une légende vide n’affiche rien.
Toutes les photos de souvenirs s’ouvrent dans une visionneuse qui affiche
la catégorie et la légende, dans l’ordre des catégories.

## Musique

La chanson (« Corentin, trente ans et du bon vin ») est dans
`public/audio/chanson-corentin.mp3`. Pour la remplacer, déposez un autre fichier sous ce nom
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

- Les paroles actuelles sont celles de la chanson Suno. Pour les changer, collez le nouveau texte entre les deux accents graves.
- Gardez une ligne vide entre les couplets.
- Les repères Suno sont affichés en français : `[Verse 1]` devient « Couplet 1 »,
  `[Chorus]` « Refrain », `[Final Chorus]` « Dernier refrain », `[Bridge]` « Pont »,
  `[Outro]` (et ses variantes, par ex. `[Outro - Group Call and Response]`) « Final ».
  Les paroles chantées ne sont pas modifiées.
- Un éventuel tiret cadratin dans les paroles est remplacé à l’affichage par une virgule.
- Tant que `lyrics` est vide, le site affiche « Les paroles arrivent bientôt ».

## Textes

Tous les autres textes (ouverture, catégories, avis des experts, toast,
pied de page) sont dans `src/content/site.ts`.
