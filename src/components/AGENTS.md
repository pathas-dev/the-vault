# Component Guidelines

## Layout.tsx

**Exports:** `Sidebar`, `Topbar`

**Sidebar** (`export const`)

- Desktop only: `hidden md:flex`, 256px width, sticky positioning
- Navigation links: 작전 개요, 전리품 기록, 최종 결산
- Active state via `useLocation()` → border-left + gold gradient bg
- User info card at bottom with icon, name, rank
- Hover transitions: text opacity & bg color shift

**Topbar** (`export const`)

- Fixed header with blur backdrop and shadow
- Props: `rightIcon` (default: 'settings'), `onRightIconClick`
- Uses Material Symbols Outlined icons
- Typography: serif font-headline for "대도의 비밀 장부"

## WallMiniMap.tsx

**Function component** displaying vault floor plan as SVG-like minimap

**Props:**

- `horizontalWall`: null | 'ㄴ' | 'ㄷ' (wall state)
- `verticalWall`: null | 'a' | 'b' | 'c' | 'd' (wall state)
- `startPoint`: optional 'A' | 'B' (entry point indicator)

**Styling:**

- Inline styles: 120px width × 56px height
- Wall indicators: tertiary color (#f1c97d) with glow shadow
- Entry points: error color (#ffb4ab) with red glow
- Borders: outline-variant at 30% opacity, rounded-[1px]

## ThemeToggle.tsx

Light/Dark/Auto switcher with localStorage persistence

**Function component** (default export)

- Cycle: light → dark → auto → light
- Storage key: 'theme'
- System detection: matchMedia('prefers-color-scheme: dark')
- Applies classes to `document.documentElement`

## Header.tsx / Footer.tsx

Alternative header and footer components. Not used in main app flow.

## demo.FormComponents.tsx

Reference/demo components: TextField, TextArea, Select, SubscribeButton

---

## Conventions

- **Function style:** Top-level exports use `export const` arrow functions; internal helpers use function declarations
- **Icons:** Material Symbols Outlined only; icon-only buttons require `aria-label`
- **Typography:** `serif-text` or `noto-serif` class for Korean thematic text; `font-headline` for serif font-family
- **Tailwind v4:** Design token custom properties; no pure white (#FFFFFF)
- **Borders:** Max `border-outline-variant/15` for ghost borders; no 1px solid for sectioning
- **Hover:** `transition-all duration-300` for state changes
- **Rounded:** No `rounded-full` except status indicators

## Do Not

- Use `rounded-full` for general UI elements
- Add 1px solid borders for visual sectioning (use background shifts instead)
- Use pure white — always use design tokens
