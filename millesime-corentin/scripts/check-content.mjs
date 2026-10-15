// Vérifications de contenu lancées avant chaque build.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const errors = [];
const EM_DASH = String.fromCharCode(0x2014);

// 1. Aucun tiret cadratin dans les textes destinés aux visiteurs.
const scanned = ['index.html', 'README.md'];
const walk = (dir) => {
  for (const name of readdirSync(join(root, dir))) {
    const rel = join(dir, name);
    if (statSync(join(root, rel)).isDirectory()) walk(rel);
    else if (['.ts', '.tsx', '.css', '.html', '.md', '.json'].includes(extname(name))) scanned.push(rel);
  }
};
walk('src');
walk('public');
for (const file of scanned) {
  readFileSync(join(root, file), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (line.includes(EM_DASH)) errors.push(`Tiret cadratin dans ${file}:${i + 1}`);
    });
}

// 2. Répartition des photos : 1 portrait, 15 Lyon & Hongrie, 7 Oléron, 3 Voyages.
const photosSrc = readFileSync(join(root, 'src/content/photos.ts'), 'utf8');
const entries = [...photosSrc.matchAll(/photo\('([a-z0-9-]+)', '([a-z-]+)'/g)].map((m) => ({ id: m[1], cat: m[2] }));
const expectedCounts = { portrait: 1, 'lyon-hongrie': 15, oleron: 7, voyages: 3 };
for (const [cat, n] of Object.entries(expectedCounts)) {
  const found = entries.filter((e) => e.cat === cat).length;
  if (found !== n) errors.push(`Catégorie ${cat} : ${found} photo(s), ${n} attendue(s)`);
}
if (new Set(entries.map((e) => e.id)).size !== entries.length) errors.push('Identifiants de photos en double');

// 3. Exactement trois catégories de souvenirs.
const siteSrc = readFileSync(join(root, 'src/content/site.ts'), 'utf8');
const catBlock = siteSrc.slice(siteSrc.indexOf('memoryCategories: MemoryCategory[]'));
const titles = [...catBlock.matchAll(/\n\s+title: '([^']+)'/g)].map((m) => m[1]);
if (JSON.stringify(titles) !== JSON.stringify(['Lyon & Hongrie', 'Oléron', 'Voyages']))
  errors.push(`Catégories inattendues : ${titles.join(', ')}`);

// 4. Jamais de consigne « COLLER ICI » dans les paroles.
if (/COLLER ICI/i.test(readFileSync(join(root, 'src/content/song.ts'), 'utf8')))
  errors.push('La consigne « COLLER ICI » est encore présente dans src/content/song.ts');

if (errors.length) {
  console.error('Vérification du contenu : échec\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`Vérification du contenu : OK (${scanned.length} fichiers, ${entries.length} photos, 3 catégories)`);
