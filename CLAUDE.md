# Español Cotidiano — Spanish for Fanny

Spanish speaking-practice app for Fanny (the user's mother-in-law, ~80, native-level
French). UI and translations are in **French**, not English. Modelled on the user's
French app at `../Le-Francais-au-Quotidien` (public: github.com/barnoy99/le-francais-au-quotidien),
but deliberately much simpler: few buttons, big text, no flags or settings.

## Status
- Step 1 (done): placement exam at `examen/index.html`, live at
  https://barnoy99.github.io/Espanol-Cotidiano/examen/
- Step 2 (in progress): the phrase app at the repo root (`index.html`).
  **Her exam results have NOT been assessed yet** — the first corpus was written
  blind, pitched at A1–A2 everyday speech with a few B1 (`lvl` on each entry).
  Once the results are read, re-level the corpus. What she told the user: the
  hardest part is understanding people when they **speak fast**.

## Files
Plain HTML/CSS/JS, no build step. `index.html`, `app.js` (one IIFE), `data.js`
(content), `style.css`, `sw.js` (offline), `manifest.json`, icons.

**Cache-busting on every asset change:** bump the file's `?v=N` in `index.html`,
the same URL in `SHELL` in `sw.js`, and `CACHE_VERSION` in `sw.js`.
Current: `app.js?v=1`, `style.css?v=1`, `data.js?v=1`, `CACHE_VERSION = 'v1'`.

## The three modes
- **Réviser les phrases** — French shown → "Voir en espagnol" reveals + speaks
  the Spanish, with 🐢 slow replay and the alt example. "✓ Je savais" sends the
  card to the back of `rvQueue`; "↺ À revoir" re-inserts it 4 cards ahead.
  Rating taps within 500 ms of the reveal are ignored (same screen spot).
- **Mains libres** — hands-free loop over every sentence (main then alt, data
  order, `hfPos`): French prompt → 7 s to say it in Spanish → Spanish slow
  (rate 0.65) → 6 s repeat → Spanish normal (0.9) → 6 s repeat → next. Wake lock
  held while running; iOS still stops speech if the screen locks.
- **Écouter et comprendre** — targets fast speech. A Spanish sentence is spoken;
  she picks the meaning among 3 French options (distractors from phrases within
  ±8 ids, i.e. same theme) or "Je ne sais pas". Speed ladder `RATES`
  (0.6 → 1.2): 3 right in a row → faster, 2 misses → slower; a right answer
  after the 🐢 replay doesn't count toward speeding up. Shuffled persistent cycle
  over all sentences (`lsCycle`/`lsPos`).

## Data
`data.js`: `{ id, lvl, ctx, es, fr, alt_es, alt_fr }` — every entry needs both
main and alt. Spain Spanish (es-ES voice), `usted` for strangers/shops/doctor,
`tú` for family/friends, labelled in `ctx` where it matters. Written for a woman
speaking (*cansada*, *perdida*, *encantada*). Append ids after the max; never
renumber.

## Progress / sync
localStorage `fannyES_v1`, mirrored to Firebase `progress/fannySpanish` (writes
are only permitted under `progress/`). Last write wins by `updatedAt`; a device
that has never saved always takes the cloud copy; nothing is pushed until the
cloud has been read. `reconcile()` adds new phrases to the queues and drops
deleted ids, so editing `data.js` is safe.

## Exam results
Answers autosave to Firebase at `progress/fannySpanishExam/<sessionId>`.
Read them with:
`curl -s "https://francais-quotidien-default-rtdb.firebaseio.com/progress/fannySpanishExam.json"`
(the cloud session's network policy blocked this host on 2026-09-30 — allow
`francais-quotidien-default-rtdb.firebaseio.com` in the environment, or run it locally).
Each record has `summary` (MCQ/listening score per CEFR level), `answers` (every
item, incl. free-text/speech-transcribed Spanish for `p*` and `t*`), `finished`.
Also stored in her browser's localStorage key `fannyExam_v1` (resume support).

## Testing
Headless Chromium + Playwright work in the cloud container; stub
`speechSynthesis` and use `page.clock` to fast-forward the hands-free timers.
Block `firebaseio.com` in tests so they never touch her live progress.
