[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mrn0p3c/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mrn0p3c/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 official PlayStation 5 trophies** of Grand Theft Auto VI
(1 platinum, 2 gold, 6 silver, 46 bronze). Every trophy carries its official name, description and
grade exactly as PlayStation publishes them, plus a guide written for this project in its own words
that names the sources it draws on, a kind (story / missable / collectibles / activities / online),
a missable flag where the official description calls for one, and a place in the platinum roadmap.

## What it does

- **Checklist & tracker** — tick trophies off as you earn them; progress (count, percent and
  per-grade progress) is saved in the browser with localStorage and survives reloads.
- **Guide panel** — selecting any trophy opens its full guide: what to do, where and how as far as
  the official descriptions and cited sources support, when it can be missed, and practical tips.
  Sources are named beside every guide; a specific step with no source named earns no trust here.
- **Filters & search** — filter by grade, by kind (story, missable, collectibles, activities,
  online — the official list contains no online trophies), by earned/unearned, plus free-text search
  across names, descriptions and guides.
- **Spoiler shield** — a toggle that hides the names and descriptions of unearned story trophies
  behind “Hidden story trophy” placeholders until they are earned.
- **Platinum roadmap** — six ordered stages built from the official descriptions: story playthrough
  (chapters and named missions) → strands, partner trophies and the missables to watch while the
  story runs → activities and crime cleanup → collectibles and exploration → the money counters and
  the 100% audit → the platinum.
- **Missables view** — the five trophies flagged missable (the VCIA departure, the showroom
  smash-out, the partnership moment, the choice counter and the fail-then-succeed trophy), each
  with the note explaining why its description makes it one-time, and a link into its full guide.
- **Export / import** — download your progress as a JSON file and import it back on any machine.

## Run it

No build step, no dependencies, no network needed at runtime — the app is plain static files.

```sh
node serve.ts            # serves app/ at http://localhost:8080
# or serve the app/ folder with any static file server, then open index.html
```

Hand the entry in the way the competition expects (copies `app/` and `screenshots/` to the output
folder and writes `dossier.json` with the vendored make.fun library):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

A demo state for a quick look: open `/?demo=1` to see the tracker with a few trophies pre-ticked
and a missable guide open; `/?view=roadmap` and `/?view=missables` jump straight to those views,
and `/?spoiler=1` starts with the spoiler shield on.

## Data & sources

- `app/data/trophies.json` holds the full list: official `name`, `description` and `grade` for all
  55 trophies, plus this project's `guide`, `sources`, `kind`, `missable` / `missableNote`, roadmap
  `stage` and tracked `target` counts where PlayStation tracks one (250 stunts, 42 Shooting Range
  challenges, 14 drone-race locations, 18 meditation spots, 52 areas of Leonida, 9 gangs, 8 garages).
- Guides draw on, and cite beside each trophy: the official PlayStation trophy list for GTA VI,
  the Exophase PSN trophy listing, the PSNProfiles trophy list and guide, and the PowerPyx trophy
  guide and roadmap. Guide text is original to this project; only the official names and
  descriptions are reproduced, as PlayStation publishes them.
- The look is original — a sunset-gradient, neon-signed design in CSS. No Rockstar Games logo,
  official artwork, box art or game screenshots are used anywhere. This is a fan-made guide and is
  not affiliated with Rockstar Games or PlayStation.

## Layout

- `app/index.html`, `app/style.css` — page shell and styling (system font stack, no webfonts).
- `app/app.js` — tracker state, checklist, filters, spoiler shield, guide panel, export/import.
- `app/roadmap.js` — the six roadmap stages and the roadmap / missables renderers.
- `app/data/trophies.json` — the 55 trophies and their guides.
- `main.ts` / `serve.ts` — hand-in program and local dev server (Node, standard library only).
- `screenshots/` — four renders of the app described in `shots.json`; the first by name is the cover.

## License

MIT — see `LICENSE`.
