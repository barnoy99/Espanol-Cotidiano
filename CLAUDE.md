# Español Cotidiano — Spanish for Fanny

Spanish speaking-practice app for Fanny (the user's mother-in-law, ~80, native-level
French). UI and translations are in **French**, not English. Modelled on the user's
French app at `../Le-Francais-au-Quotidien` (read its CLAUDE.md / HANDOFF.md for the
architecture to reuse).

## Status
- Step 1 (done): placement exam at `examen/index.html`, live at
  https://barnoy99.github.io/Espanol-Cotidiano/examen/
- Step 2 (next): assess her results, then build the phrase app sized to her level.

## Exam results
Answers autosave to Firebase (same project as the French app) at
`progress/fannySpanishExam/<sessionId>` — writes are only permitted under `progress/`.
Read them with:
`curl -s "https://francais-quotidien-default-rtdb.firebaseio.com/progress/fannySpanishExam.json"`
Each record has `summary` (MCQ/listening score per CEFR level), `answers` (every
item, incl. free-text/speech-transcribed Spanish for `p*` and `t*`), `finished`.
Also stored in her browser's localStorage key `fannyExam_v1` (resume support).
