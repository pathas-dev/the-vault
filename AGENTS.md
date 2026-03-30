# AGENTS.md — The Vault (대도의 비밀 장부)

Agent operating guide. Read this before touching any file in this project.

---

## Project Identity

- **Name:** The Vault (대도의 비밀 장부)
- **Theme:** High-stakes heist / stealth editorial aesthetic — "The Shadow Architect"
- **Stack:** React 19, TanStack Start/Router/Form/Table, TypeScript 5.7, Vite 7.3, Tailwind CSS v4, Vitest
- **Package manager:** pnpm
- **Path alias:** `@/*` → `./src/*`

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

## Project Structure

```
src/
├── styles.css                    # ALL design tokens (@theme), base styles, utilities
├── router.tsx                    # TanStack Router configuration
├── routeTree.gen.ts              # AUTO-GENERATED — never edit manually
├── components/
│   ├── Layout.tsx                # Sidebar + Topbar shell
│   ├── Header.tsx                # Alternative header (not used in main app)
│   ├── Footer.tsx                # Footer
│   ├── ThemeToggle.tsx           # Light/Dark/Auto theme switcher
│   ├── WallMiniMap.tsx           # Vault wall/entry point visualization
│   └── demo.FormComponents.tsx   # Reusable form field components
├── routes/
│   ├── __root.tsx                # Root layout: HTML shell, dark-mode script, devtools
│   ├── index.tsx                 # Landing page with hero CTA
│   ├── record.tsx                # Multi-round vault recording form (primary feature)
│   ├── summary.tsx               # Results summary with per-round breakdown
│   └── about.tsx                 # About page
├── hooks/
│   ├── demo.form.ts              # Form state management
│   └── demo.form-context.ts      # Form context provider
└── data/
    └── demo-table-data.ts        # Sample data for table demos
```

**Routing:** File-based via TanStack Router. Adding a route file triggers auto-generation of `routeTree.gen.ts`. Never edit `routeTree.gen.ts` directly.

**State persistence:** Round data is stored in `sessionStorage` under the key `vault_rounds`.

---

## Design System — Non-Negotiable Rules

The full spec lives in `DESIGN.md`. These are the hard constraints agents must follow:

### Colors

| Token          | Value     | Use                             |
| -------------- | --------- | ------------------------------- |
| Primary (gold) | `#ffc637` | CTAs, accents, highlights       |
| Surface base   | `#10141a` | Page background                 |
| Surface 1      | `#181c22` | Cards, panels                   |
| Surface 2      | `#262a31` | Elevated surfaces               |
| Surface 3      | `#31353c` | Highest elevation               |
| On-surface     | `#dfe2eb` | Body text — never use `#FFFFFF` |

- **No-Line Rule:** Do not use `border` / `1px solid` for visual sectioning. Use surface color stacking instead.
- **Glass & Gold Rule:** Floating elements use glassmorphism: `backdrop-blur-[20px]` + 60% opacity background.
- **Ghost borders:** `outline` using `outline-variant` color at max 15% opacity only.
- **No `rounded-full`** except status indicator dots.
- **No standard success green.** Use tertiary (`#f1c97d`) for positive states.

### Typography

- **Headlines / thematic values:** Noto Serif KR — apply via `noto-serif` class
- **Body / labels / UI:** Manrope
- **Icons:** Material Symbols Outlined (inline SVG or font) + Lucide React
- **Minimum text size:** 9px (`0.5625rem`) — used for uppercase tracking labels only
- Typography scale tokens defined in `@theme` block in `styles.css`: `--text-display-lg` through `--text-label-xs`
- Tracking tokens: `--tracking-tight` through `--tracking-ultra`

### Radius tokens (from `@theme`)

| Token | Value      |
| ----- | ---------- |
| `sm`  | `0.125rem` |
| `md`  | `0.25rem`  |
| `lg`  | `0.5rem`   |
| `xl`  | `0.75rem`  |

### Utility classes (defined in `styles.css`)

| Class                | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `gold-gradient`      | Gold gradient background for primary CTAs |
| `gold-text-gradient` | Gold gradient applied as text fill        |
| `blueprint-bg`       | Dot-pattern background                    |
| `custom-scrollbar`   | Styled scrollbar                          |
| `label-micro`        | 9px uppercase metadata label              |
| `label-small`        | 10px uppercase metadata label             |

---

## Tailwind CSS v4 Rules

- **No `tailwind.config.js`.** All configuration lives in the `@theme` block inside `src/styles.css`.
- All custom tokens (colors, spacing, typography, radius) are CSS custom properties under `@theme`.
- Use Tailwind utility classes that map to these `@theme` variables — do not hardcode hex values inline.

---

## Language Conventions

- **UI text:** Korean (thematic tone per `DESIGN.md`)
- **Code identifiers:** English
- **Uppercase tracking labels:** English (e.g., `ROUND`, `VAULT ID`)
- Use `noto-serif` class on thematic headlines and displayed values
- Use `tracking-widest` + uppercase for category/metadata labels

---

## Accessibility Requirements

- All interactive elements must have `:focus-visible` ring — globally applied in `styles.css`, do not remove.
- Icon-only buttons require `aria-label`.
- Maintain proper contrast ratios against dark surfaces.
- Use semantic HTML elements.

---

## What Not to Do

- Do not edit `routeTree.gen.ts` — it is auto-generated by TanStack Router.
- Do not use `border: 1px solid` for layout separation.
- Do not use `#FFFFFF` for text — use `on-surface` (`#dfe2eb`).
- Do not use `rounded-full` on anything except status dots.
- Do not use green for positive feedback — use tertiary gold (`#f1c97d`).
- Do not add a `tailwind.config.js` — config belongs in `styles.css @theme`.
- Do not hardcode color values inline — use `@theme` tokens via Tailwind classes.
