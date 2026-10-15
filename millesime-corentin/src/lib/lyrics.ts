// Transforme les paroles brutes en strophes affichables.
// Seuls les repères de section ([Verse 1], [Chorus]...) sont traduits.
// Les paroles chantées ne sont jamais modifiées, sauf le tiret cadratin,
// remplacé par une virgule (ou supprimé en fin de ligne).

export interface Stanza {
  heading?: string;
  lines: string[];
}

const SECTION_LABELS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^verse\s*(\d+)?$/i, (m) => (m[1] ? `Couplet ${m[1]}` : 'Couplet')],
  [/^pre[\s-]?chorus$/i, () => 'Pré-refrain'],
  [/^post[\s-]?chorus$/i, () => 'Après le refrain'],
  [/^final\s+chorus$/i, () => 'Dernier refrain'],
  [/^(chorus|hook)(\s*\d+)?$/i, () => 'Refrain'],
  [/^bridge$/i, () => 'Pont'],
  // « [Outro - Group Call and Response] » : on garde seulement « Final ».
  [/^outro\b.*$/i, () => 'Final'],
  [/^intro$/i, () => 'Introduction'],
  [/^instrumental(\s.*)?$/i, () => 'Instrumental'],
  [/^end$/i, () => 'Fin'],
];

export function translateSection(raw: string): string {
  const label = raw.trim();
  for (const [pattern, toFrench] of SECTION_LABELS) {
    const match = label.match(pattern);
    if (match) return toFrench(match);
  }
  return label;
}

const EM_DASH = String.fromCharCode(0x2014);

export function removeEmDash(line: string): string {
  if (!line.includes(EM_DASH)) return line;
  return line
    .replace(new RegExp(`\\s*${EM_DASH}\\s*$`), '')
    .replace(new RegExp(`^\\s*${EM_DASH}\\s*`), '')
    .replace(new RegExp(`\\s*${EM_DASH}\\s*`, 'g'), ', ');
}

export function parseLyrics(raw: string): Stanza[] {
  const stanzas: Stanza[] = [];
  let current: Stanza | null = null;

  const flush = () => {
    if (current && (current.heading || current.lines.length)) stanzas.push(current);
    current = null;
  };

  for (const rawLine of raw.replace(/\r\n?/g, '\n').split('\n')) {
    const line = rawLine.trim();
    const section = line.match(/^\[(.+)\]$/);
    if (section) {
      flush();
      current = { heading: translateSection(section[1]), lines: [] };
    } else if (line === '') {
      if (current && current.lines.length) flush();
    } else {
      if (!current) current = { lines: [] };
      // Espace insécable avant ! ? : ; pour éviter une ponctuation seule en début de ligne.
      current.lines.push(removeEmDash(line).replace(/ ([!?:;])/g, '\u00A0$1'));
    }
  }
  flush();
  return stanzas;
}
