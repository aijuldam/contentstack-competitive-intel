# Contentstack Competitive Intelligence

An AI-powered competitive intelligence system that continuously monitors the headless CMS and composable DXP market, extracts structured intelligence using Claude, and maintains always-fresh battle cards for Contentstack's product marketing team.

**Live dashboard:** https://aijuldam.github.io/contentstack-competitive-intel/  
**GitHub repo:** https://github.com/aijuldam/contentstack-competitive-intel

---

## What it does

1. Monitors 8 competitors (Contentful, Sanity, Storyblok, Hygraph, Kontent.ai, Adobe AEM, Sitecore, Bloomreach)
2. Fetches their public websites daily and detects changes via SHA256 hashing
3. Extracts structured competitive intelligence using Claude (pricing, product launches, positioning, strengths, weaknesses)
4. Generates JSON battle cards committed to this repo
5. Renders a static single-page dashboard deployed to GitHub Pages — no server required

---

## Architecture

```
config/config.yaml          ← Edit this to change target company, competitors, or monitored URLs
main.py                     ← CLI: run / digest / staleness / seed / review / schedule
orchestrator.py             ← 7-agent pipeline coordinator
src/agents/                 ← Claude-powered agents (generic — domain from config.yaml)
src/connectors/             ← httpx web fetcher, SHA256 hasher, diff engine
src/models/schemas.py       ← Pydantic data models
src/outputs/                ← JSON / markdown / digest writers
src/storage/database.py     ← SQLite persistence
src/utils/                  ← Config loader, logging
index.html                  ← Static SPA dashboard (reads embedded JSON)
data/battlecards/json/      ← Pipeline outputs, committed by GitHub Actions
scripts/inject_battlecards.py  ← Merges JSON back into index.html for static hosting
.github/workflows/
  competitive-intel.yml     ← Daily pipeline (cron) → commits JSON → triggers Pages redeploy
  pages.yml                 ← Deploys index.html + data/ to GitHub Pages
```

### Agent pipeline

```
Web Monitor → Extraction → Company Intel → Positioning Analysis
  → Battle Card Writer → QA Agent → JSON/Markdown/Digest outputs
```

Only pages with detected changes trigger downstream agents (delta-based processing).

---

## Setup

### Prerequisites

- Python 3.11+
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

### Local installation

```bash
git clone https://github.com/aijuldam/contentstack-competitive-intel
cd contentstack-competitive-intel
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Run the pipeline

```bash
# Process all competitors
python main.py run

# Priority competitors only (Contentful, Sanity, Storyblok, Hygraph)
python main.py run --priority

# Force re-process even if no changes detected
python main.py run --force

# Single competitor by slug
python main.py run --competitor contentful

# Generate weekly digest
python main.py digest

# Check for stale data
python main.py staleness

# Seed database from config.yaml
python main.py seed

# View pending review queue
python main.py review
```

---

## GitHub Actions (automated pipeline)

The pipeline runs automatically on a schedule via GitHub Actions:

| Workflow | Schedule | What it does |
|---------|----------|-------------|
| `competitive-intel.yml` | Daily at 2 AM UTC | Fetches all competitors, generates JSON battlecards, commits to repo, triggers Pages redeploy |
| `pages.yml` | On every push to `main` | Deploys `index.html` + `data/` to GitHub Pages |

### Adding your Anthropic API key

The pipeline requires `ANTHROPIC_API_KEY` as a GitHub Actions secret:

1. Go to `https://github.com/aijuldam/contentstack-competitive-intel/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: your key from `https://console.anthropic.com/settings/keys`
5. Click **Add secret**

Once the secret is set, trigger the first run manually:  
**Actions tab → "Competitive Intelligence Pipeline" → Run workflow**

---

## How competitor identification works

Competitors are defined in [`config/config.yaml`](config/config.yaml) under the `competitors:` key. Each entry specifies:

- `name`, `slug`, `website` — identity
- `is_priority` — if `true`, checked every 12 hours; if `false`, every 24 hours
- `tracked_urls` — organized by category (homepage, pricing, product, blog, changelog, careers, docs, investor_relations, social, custom)

The pipeline web-monitors each URL, computes a SHA256 hash of the page text, compares it to the previous snapshot, and only triggers AI extraction on pages that changed.

---

## How to update the target company

All target company context lives in `config/config.yaml` under `our_company:`:

```yaml
our_company:
  name: "Contentstack"
  category: "Headless CMS / Composable DXP"
  description: "..."
  strengths:
    - "..."
  weaknesses:
    - "..."
```

To adapt this project for a different company: update the `our_company` block and the `competitors` list in `config/config.yaml`, then run `python main.py seed` to re-initialize the database.

---

## How to add or remove a competitor

Edit `config/config.yaml`:

```yaml
competitors:
  - name: "New Competitor"
    slug: "new-competitor"
    website: "https://newcompetitor.com"
    is_priority: false
    tracked_urls:
      homepage: "https://newcompetitor.com"
      pricing: "https://newcompetitor.com/pricing"
      blog: "https://newcompetitor.com/blog"
```

Then run `python main.py seed` to register the new competitor in the database.

---

## Monitored competitors

| Competitor | Priority | Category |
|-----------|----------|----------|
| Contentful | ✓ High | Headless CMS |
| Sanity | ✓ High | Headless CMS |
| Storyblok | ✓ High | Visual Headless CMS |
| Hygraph | ✓ High | GraphQL-native CMS |
| Kontent.ai | Standard | Enterprise Headless CMS |
| Adobe AEM | Standard | Enterprise DXP |
| Sitecore | Standard | Enterprise DXP |
| Bloomreach | Standard | Commerce DXP |

---

## Deployment

The dashboard is a static HTML file (`index.html`) with all competitor data embedded as JavaScript. No server or runtime is required.

**GitHub Pages** serves the file automatically on every push to `main`. The URL is:  
`https://aijuldam.github.io/contentstack-competitive-intel/`

To enable GitHub Pages for a new repo:  
Settings → Pages → Source: **GitHub Actions**

---

## Confidence system

Every fact carries a confidence level:

| Level | Meaning |
|-------|---------|
| `high` | Direct authoritative source (earnings report, official page) |
| `medium` | Reputable secondary source |
| `low` | Inferred or single weak source |
| `speculative` | Hypothesis, no hard evidence |

High-confidence data is never overwritten by lower-confidence data.  
Low-confidence updates go to the review queue (`python main.py review`) for human validation.
