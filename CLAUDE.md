# Español Cotidiano — Spanish for Fanny

Spanish speaking-practice app for Fanny (the user's mother-in-law, ~80, native-level
French). UI and translations are in **French**, not English. Modelled on the user's
French app at `../Le-Francais-au-Quotidien` (public: github.com/barnoy99/le-francais-au-quotidien),
but deliberately much simpler: few buttons, big text, no flags or settings.

## Status
- Step 1 (done): placement exam at `examen/index.html`, live at
  https://barnoy99.github.io/Espanol-Cotidiano/examen/
- Step 2 (in progress): the phrase app at the repo root (`index.html`), levelled
  on her exam results.

## Learner profile (from the exam)
This repo is public: **do not write her scores, her exam answers, or personal
details here.** Read them from Firebase when needed (see Exam results).
- Level: roughly A2; listening is the weakest skill. The corpus is mostly A2
  with a B1 stretch.
- The problem she names is fast speech. She also struggles to find her words and
  with conjugations. Her priority is telling what she did and her memories (past
  tenses).
- She prefers listening without the screen, repeating aloud, and answering
  questions like a real conversation. About 30 min a day, iPhone, tú and usted.
- Some personal sentences in `data.js` use facts she gave in the exam. Don't
  invent other facts about her life.

## Files
Plain HTML/CSS/JS, no build step. `index.html`, `app.js` (one IIFE), `data.js`
(content), `style.css`, `sw.js` (offline), `manifest.json`, icons.

**Cache-busting on every asset change:** bump the file's `?v=N` in `index.html`,
the same URL in `SHELL` in `sw.js`, and `CACHE_VERSION` in `sw.js`.
Current: `app.js?v=3`, `style.css?v=1`, `data.js?v=2`, `CACHE_VERSION = 'v3'`.

## Slow speech (`speakSlow`)
iOS voices barely change speed with `rate` (0.6 sounds almost like 0.85), so
every 🐢 / "lentement" says the sentence in short word groups (`slowChunks`: split
at punctuation, ~3 words per group, never ending a group on *la/a/de/que*…) at
rate 0.6 with a 450 ms pause between groups. `speechGen` cancels a chain in
progress; every `speak`/`stopSpeech` bumps it. Used by Réviser (main and alt),
the Mains libres slow step, and Écouter's 🐢 button and replay after a miss.

## The three modes
- **Réviser les phrases** — French shown → "Voir en espagnol" reveals + speaks
  the Spanish, with 🐢 slow replay, and the alt example (also 🔊 and 🐢). "✓ Je savais" sends the
  card to the back of `rvQueue`; "↺ À revoir" re-inserts it 4 cards ahead.
  Rating taps within 500 ms of the reveal are ignored (same screen spot).
- **Mains libres** — hands-free loop over every sentence (main then alt, data
  order, `hfPos`): French prompt → 7 s to say it in Spanish → Spanish slow
  (`speakSlow`) → 6 s repeat → Spanish normal (0.9) → 6 s repeat → next. Wake lock
  held while running; iOS still stops speech if the screen locks.
- **Écouter et comprendre** — targets fast speech. A Spanish sentence is spoken;
  she picks the meaning among 3 French options (distractors from phrases within
  ±6 positions in `data.js`, i.e. same section) or "Je ne sais pas". Speed ladder `RATES`
  (0.6 → 1.2): 3 right in a row → faster, 2 misses → slower; a right answer
  after the 🐢 replay doesn't count toward speeding up. Shuffled persistent cycle
  over all sentences (`lsCycle`/`lsPos`).

## Data
`data.js`: `{ id, lvl, ctx, es, fr, alt_es, alt_fr }` — every entry needs both
main and alt. Spain Spanish (es-ES voice), `usted` for strangers/shops/doctor,
`tú` for family/friends, labelled in `ctx` where it matters. Written for a woman
speaking (*cansada*, *perdida*, *encantada*). 108 entries / 216 sentences.
**File order is teaching order** (Réviser and Mains libres walk it): understanding
and finding words, talking about herself, questions, greetings, then *Raconter*
(past tenses), memories, then everyday situations. `ctx` labels starting "Piège"
drill the common mistakes of a French speaker (her exam errors included); "Ce qu'on
vous dit" are sentences she'll *hear*. Ids are not in file order: append new ids
after the max (108); never renumber.

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
