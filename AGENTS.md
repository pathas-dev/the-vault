# AGENTS.md — The Vault (대도의 비밀 장부)

Agent operating guide. Read this before touching any file in this project.

---

## Project Identity

- **Name:** The Vault (대도의 비밀 장부)
- **Theme:** High-stakes heist / stealth editorial aesthetic — "The Shadow Architect"
- **Stack:** React 19, TanStack Start/Router, TypeScript 6, Vite 8, Tailwind CSS v4, Zod 4, Vitest
- **Package manager:** pnpm
- **Path alias:** `@/*` → `./src/*`
- **Architecture:** Feature-Sliced Design (FSD) v2.1

---

## Commands

```bash
pnpm dev        # dev server on :3000
pnpm build      # production build
pnpm test       # vitest run (no watch)
pnpm lint       # eslint
pnpm format     # prettier --check .
pnpm check      # prettier --write . && eslint --fix (auto-fix)
```

---

## FSD Architecture

Import rule: `app → pages → entities → shared`. Upward imports and cross-imports between slices on the same layer are forbidden.

```
src/
├── styles.css                        # Design tokens (@theme), base styles, utilities, animations
├── router.tsx                        # TanStack Router configuration
├── routeTree.gen.ts                  # AUTO-GENERATED — never edit manually
│
├── routes/                           # Route shells only (thin wrappers)
│   ├── __root.tsx                    # Root layout: HTML shell, dark-mode, ErrorBoundary, DevTools (DEV only)
│   ├── index.tsx                     # → pages/record/RecordScreen
│   └── summary.tsx                   # → pages/summary/SummaryScreen
│
├── pages/                            # Page-level slices (route-bound)
│   ├── record/                       # Main vault recording page
│   │   ├── ui/
│   │   │   ├── RecordScreen.tsx      # Orchestrator (~180 lines)
│   │   │   ├── FloorPlan.tsx         # Vault grid + walls + entry points
│   │   │   ├── VaultCell.tsx         # Individual vault toggle button
│   │   │   ├── WallButton.tsx        # HWallButton + VWallButton
│   │   │   ├── VaultValueTable.tsx   # Value input table with validation
│   │   │   ├── MobileNumpad.tsx      # Mobile numpad overlay with error shake
│   │   │   ├── HistoryPanel.tsx      # Slide-over round history drawer
│   │   │   └── RoundHeader.tsx       # Phase title, progress bar, target house selector
│   │   ├── model/
│   │   │   ├── round-state.ts        # useRoundState (useReducer-based state management)
│   │   │   └── keyboard-nav.ts       # useKeyboardNavigation (Enter/Arrow key input navigation)
│   │   └── index.ts                  # Public API: exports RecordScreen
│   │
│   └── summary/                      # Final results page
│       ├── ui/
│       │   ├── SummaryScreen.tsx      # Main results display
│       │   ├── RoundCard.tsx          # Per-round card (mobile grid + desktop table)
│       │   └── CountUpTotal.tsx       # Animated count-up display
│       ├── model/
│       │   └── count-up.ts            # useCountUp hook
│       └── index.ts                   # Public API: exports SummaryScreen
│
├── entities/                          # Domain models shared across pages
│   └── round/                         # Round data domain
│       ├── model/
│       │   └── round.ts               # Zod schema (enum-constrained), RoundData type
│       ├── lib/
│       │   └── scoring.ts             # calculateRoundTotal, calculateGrandTotal
│       └── index.ts                   # Public API: schemas, types, scoring
│
└── shared/                            # Infrastructure with no business logic
    ├── config/
    │   └── vault.ts                   # VAULT_CONFIG, VAULT_NUMBERS, TOTAL_ROUNDS, wall/house constants
    ├── api/
    │   ├── storage.ts                 # sessionStorage CRUD (getSavedRounds, saveRounds, clearSavedRounds)
    │   └── storage.test.ts            # Vitest unit tests (6 tests)
    ├── ui/
    │   ├── ConfirmDialog.tsx           # Reusable modal dialog (danger/default variants)
    │   └── WallMiniMap.tsx             # Wall/entry point visualization
    ├── lib/
    │   ├── validation.ts              # isValidValue, isFormValid
    │   └── use-submit-guard.ts        # useSubmitGuard double-click prevention hook
    └── layout/
        └── FloatingActions.tsx         # Top-right floating action buttons
```

**Routing:** File-based via TanStack Router. Route files in `src/routes/` are thin shells that import from `src/pages/`. Adding/removing route files triggers auto-generation of `routeTree.gen.ts`.

**State persistence:** Round data stored in `sessionStorage` under key `vault_rounds` as JSON array. **DO NOT** change this key name.

**Public API rule:** Each slice exports through `index.ts`. External consumers import from the barrel only, never from internal files.

---

## Key Domain Concepts

**RoundData** — A single round of vault recording:
- `targetHouse`: `'A' | 'B' | 'C' | 'D'`
- `startPoint`: `'A' | 'B'`
- `horizontalWall`: `'ㄴ' | 'ㄷ' | null`
- `verticalWall`: `'a' | 'b' | 'c' | 'd' | null`
- `vaultValues`: `Record<string, string[]>` — vault number → value array

**Vault layout:** 17 vaults across 4 rooms (401, 3xx, 2xx, 1xx). Each vault has a capacity (1-3 values). Configuration in `shared/config/vault.ts`.

**Game flow:** 7 rounds max. Each round: select vaults → set target house → place walls → set entry point → input values → confirm → next round → final summary.

---

## Design System — Non-Negotiable Rules

Full spec in `DESIGN.md`. Hard constraints:

### Colors

| Token          | Value     | Use                             |
| -------------- | --------- | ------------------------------- |
| Primary (gold) | `#ffc637` | CTAs, accents, highlights       |
| Surface base   | `#10141a` | Page background                 |
| Surface 1      | `#181c22` | Cards, panels                   |
| Surface 2      | `#262a31` | Elevated surfaces               |
| Surface 3      | `#31353c` | Highest elevation               |
| On-surface     | `#dfe2eb` | Body text — never use `#FFFFFF` |

- **No-Line Rule:** No `border` / `1px solid` for visual sectioning. Use surface color stacking.
- **Glass & Gold Rule:** Floating elements use glassmorphism: `backdrop-blur-[20px]` + 60% opacity.
- **No `rounded-full`** except status indicator dots.
- **No standard success green.** Use tertiary (`#f1c97d`) for positive states.

### Typography

- **Headlines / thematic values:** Noto Serif KR (`noto-serif` class)
- **Body / labels / UI:** Manrope
- **Icons:** Material Symbols Outlined
- Typography scale tokens in `@theme` block in `styles.css`

### Radius tokens

| Token | Value      |
| ----- | ---------- |
| `sm`  | `0.125rem` |
| `md`  | `0.25rem`  |
| `lg`  | `0.5rem`   |
| `xl`  | `0.75rem`  |

---

## Tailwind CSS v4 Rules

- **No `tailwind.config.js`.** All configuration in `@theme` block inside `src/styles.css`.
- Use Tailwind utility classes mapped to `@theme` variables — no inline hex values.

---

## What Not to Do

- Do not edit `routeTree.gen.ts` — auto-generated by TanStack Router.
- Do not import across slices on the same layer (e.g., pages/record → pages/summary).
- Do not import upward (e.g., shared → entities, entities → pages).
- Do not bypass public API (`index.ts`) — no deep imports into slice internals.
- Do not put business logic in `shared/` — only infrastructure.
- Do not use `border: 1px solid` for layout separation.
- Do not use `#FFFFFF` for text — use `on-surface` (`#dfe2eb`).
- Do not use `rounded-full` on anything except status dots.
- Do not hardcode color values inline — use `@theme` tokens.
- Do not change `sessionStorage` key `vault_rounds`.
