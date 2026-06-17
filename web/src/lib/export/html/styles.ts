export const BASE_STYLES = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --text: #111827; --text-muted: #6b7280;
  --border: #e5e7eb; --accent: #2563eb;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
}
body { font-family: var(--font); color: var(--text); -webkit-font-smoothing: antialiased; }
.tag {
  display: inline-block; font-size: .6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  padding: .2rem .5rem; border-radius: 999px;
}
.tag-verified { background: #d1fae5; color: #065f46; }
.tag-inferred { background: #fef3c7; color: #92400e; }
@media print { .no-print { display: none !important; } }
`;

export const PITCH_DECK_STYLES = `
body { background: #f1f5f9; padding: 2rem 0; }
.deck-header { max-width: 1200px; margin: 0 auto 2rem; padding: 0 1rem; display: flex; align-items: baseline; gap: 1rem; }
.deck-header h1 { font-size: 1rem; font-weight: 700; }
.deck-header .meta { font-size: .75rem; color: var(--text-muted); }
.slides { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.slide {
  position: relative; background: #0f172a; color: white;
  border-radius: 12px; overflow: hidden; width: 100%; aspect-ratio: 16/9;
  display: flex; flex-direction: column; justify-content: center; padding: 8%;
  margin-bottom: 2rem;
}
.slide-num { position: absolute; top: 1.25rem; right: 1.5rem; font-size: .7rem; color: rgba(255,255,255,.35); font-variant-numeric: tabular-nums; }
.slide-label { font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .18em; color: rgba(255,255,255,.45); margin-bottom: 1.25rem; }
.slide-body { font-size: clamp(1rem,2.5vw,1.5rem); font-weight: 300; line-height: 1.65; color: white; max-width: 80%; white-space: pre-wrap; }
.slide:first-of-type .slide-body { font-size: clamp(1.25rem,3vw,2rem); }
.slide-badge { position: absolute; bottom: 1.25rem; right: 1.5rem; }
@media print {
  body { background: none; padding: 0; }
  .slides { padding: 0; max-width: none; }
  .slide { border-radius: 0; margin: 0; page-break-after: always; height: 100vh; aspect-ratio: unset; }
}
`;

export const ONE_PAGER_STYLES = `
body { background: white; }
.doc { max-width: 740px; margin: 0 auto; padding: 4rem 3rem; }
.doc-headline { font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 3px solid var(--accent); }
.section { margin-bottom: 2rem; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .6rem; }
.section-title { font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: var(--accent); }
.section-body { font-size: .9rem; line-height: 1.75; white-space: pre-wrap; }
.doc-footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: .7rem; color: var(--text-muted); display: flex; justify-content: space-between; }
@media print { .doc { padding: 2rem; max-width: none; } }
`;

export const SALES_DECK_STYLES = `
body { background: #f9fafb; }
.deck { max-width: 880px; margin: 0 auto; padding: 3rem 2rem; }
.deck-title { font-size: 1.25rem; font-weight: 800; margin-bottom: .5rem; }
.deck-meta { font-size: .75rem; color: var(--text-muted); margin-bottom: 2.5rem; }
.toc { background: white; border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem 1.5rem; margin-bottom: 3rem; }
.toc-label { font-size: .6rem; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: var(--text-muted); margin-bottom: .75rem; }
.toc-links { display: flex; flex-wrap: wrap; gap: .5rem; }
.toc-link { font-size: .8rem; color: var(--accent); text-decoration: none; padding: .3rem .75rem; border: 1px solid #dbeafe; border-radius: 4px; background: #eff6ff; }
.tab-group { margin-bottom: 4rem; }
.tab-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; padding-bottom: .75rem; border-bottom: 2px solid var(--accent); }
.section { background: white; border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .6rem; }
.section-title { font-size: .6rem; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: var(--text-muted); }
.section-body { font-size: .875rem; line-height: 1.75; white-space: pre-wrap; }
@media print {
  .tab-group { page-break-before: always; }
  .tab-group:first-child { page-break-before: avoid; }
  .toc { display: none; } body { background: white; }
}
`;
