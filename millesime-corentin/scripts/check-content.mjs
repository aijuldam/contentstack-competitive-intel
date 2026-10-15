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

// 2. Exactement dix photos, réparties 1 portrait + 3 x 3 souvenirs.
const photosSrc = readFileSync(join(root, 'src/content/photos.ts'), 'utf8');
const ids = [...photosSrc.matchAll(/id: '(photo-\d+)'/g)].map((m) => m[1]);
const cats = [...photosSrc.matchAll(/category: '([a-z-]+)'/g)].map((m) => m[1]);
const expectedIds = Array.from({ length: 10 }, (_, i) => `photo-${String(i + 1).padStart(2, '0')}`);
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) errors.push(`Photos attendues : ${expectedIds.join(', ')}`);
const expectedCats = ['portrait', ...Array(3).fill('lyon-hongrie'), ...Array(3).fill('oleron'), ...Array(3).fill('voyages')];
if (JSON.stringify(cats) !== JSON.stringify(expectedCats)) errors.push('Répartition des catégories incorrecte');

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
console.log(`Vérification du contenu : OK (${scanned.length} fichiers, 10 photos, 3 catégories)`);
