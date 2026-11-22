# HANDOFF — Combat-RPG-prototype-

**Last updated: 2026-11-22 (America/New_York).**
**Repo:** `mhvnsnt/Combat-RPG-prototype-` (PUBLIC), default branch `main`.
**Purpose of this file:** any agent that picks up work here reads this FIRST, then the linked docs. It states what we've done, where we're at, and what we're working toward — so the owner can say "go to this repo, pick up the work" and you just know. Update this file in the same PR whenever the state changes (add, don't delete).

## 1. What this repo is

A tiny **combat RPG prototype** — a Vite + TypeScript web prototype (48 KB on disk). Repo description: "Combat rpg". That is all the repo says about itself; there is no README.

What is in here: a minimal web app (`app/`, `index.html`, `server.js`, `public/`, `package.json`, `vite.config.ts`, `tsconfig.json`), `docs/`, and the agent working docs (`AGENTS.md`, `WORKING-METHOD.md`). Created 2026-09-04. It is a prototype — an early combat experiment, not a game.

## 2. Where we're at

### DONE
- **Prototype staged (created 2026-09-04).** The combat RPG prototype as it stood, 48 KB.
- **Anti-clobber laws landed (2026-10-17).** "ANTI-CLOBBER LAWS (owner 2026-10-17 — the DXMMII 54k-file wipe)" — committed directly to main.
- **Working method statement (2026-10-27).** "Add working method statement" — the last commit on main.

### IN PROGRESS
- **Docs PR #5 — "Docs: sourcing rule (Mars, 2026-11-19)"** (open). The sourcing rule doc, waiting on merge.
- **Docs PR #6 — "Docs: pre-made parts first rule (Mars, 2026-11-20)"** (open). The pre-made-parts-first rule doc, waiting on merge.

### BLOCKED
- **Nothing is blocked — and nothing is being built.** No code commits since 2026-10-27. The only open work is the two docs PRs. This is a parked prototype until the owner says otherwise (see §6).

## 3. What we're working toward

**The goal for this repo, as far as anyone can tell from its state: be the preserved combat RPG prototype.** It is an early experiment in combat systems — the kind of work that later fed the bigger combat games (Brutal Fist, Urban Mayhem, Infinity-Fighter). Whether anything in it is still used is not documented in the repo; do not claim a lineage that is not written down.

**The bar for done here:** the two open docs PRs merged, this HANDOFF.md kept current, and nothing deleted or overwritten. If the owner ever points live work at this prototype again, that decision restarts this section — it has not happened.

## 4. Standing rules that apply here

- **Branch → PR → merge, always.** Never push to main directly. Add-only, zero-conflict PRs, no force pushes.
- **Checkpoint-and-save law:** CHECKPOINT.md first, update after every step; the repo is the save; resume, never restart.
- **No-temp-storage law:** nothing in /tmp or any wipeable location, ever. Everything goes straight into the repo or a durable folder the second it exists.
- **Real-source-only:** every part comes from the actual source code and files, wired up fully. No hand-tooled lookalikes, no fake panels.
- **Never delete game files.** Game files (ISOs, ROMs, game archives, teardown source) are never auto-deleted. They come off local disk only after 100% hash/size-verified storage on GitHub OR TeraBox, retrievability proven, and the deletion logged.
- **No-gaps / solve-it law:** a gap or block is never the end of the work — route-switch until it's done or every reasonable route is exhausted with exact errors recorded.
- **Never kill in-progress work.** Never delete another lane's work without the standing verification rules.
- **Anti-clobber laws apply here** (landed 2026-10-17) — they exist because a 54k-file wipe happened once. Read them in `docs/` before touching anything bulk.

## 5. Key files and paths

| What | Where |
|---|---|
| App entry | `app/`, `index.html` |
| Server | `server.js` |
| Agent working docs | `AGENTS.md`, `WORKING-METHOD.md` |
| Docs (incl. owner laws) | `docs/` |
| App config | `package.json`, `vite.config.ts`, `tsconfig.json` |
| Open work | PR #5 (sourcing rule), PR #6 (pre-made parts first rule) |

## 6. Open decisions needing the owner

- **Is this prototype parked, or does it feed a live game?** Everything in the repo's state says parked (no code commits since 2026-10-27, only docs PRs open). If it feeds Brutal Fist, Urban Mayhem, or another game, he says which one — lanes do not guess the lineage.
- **The two open docs PRs (#5, #6):** merge them or leave them? They are docs-only and add-only; merging is low-risk, but the call is his if he wants them held.

## 7. How to pick up

1. Read this HANDOFF.md first, then `AGENTS.md` and `WORKING-METHOD.md` in the repo.
2. Check the open PRs (#5, #6) — if they are still open, that is the next step.
3. Do not start new feature work here unless the owner has named this prototype live. Do not assume it feeds another game — ask, or find it written down.
4. Resume from the stated next step — never restart, never re-derive finished work.
5. Land work branch → PR → merge, add-only. Stage finished work to the repo as it lands.
6. Update this HANDOFF.md in the same PR when the state changes. Verify with your own eyes before claiming anything done.
