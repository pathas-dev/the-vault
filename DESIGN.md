```markdown
# Design System Specification: High-End Stealth Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Shadow Architect"**

This design system is built to evoke the tension of a high-stakes heist and the refinement of a private vault. We move away from the "generic dashboard" aesthetic by embracing **Atmospheric Asymmetry**. The UI should feel like a redacted intelligence dossier—mysterious, authoritative, and intentionally sparse.

To break the "template" look, we avoid rigid center-alignment. Instead, we use "Weighted Negative Space," where large blocks of typography are offset against deep, layered shadows. We prioritize intentional overlapping (e.g., a serif headline bleeding slightly over a glass container) to create a sense of bespoke, editorial depth that feels premium and curated for the Korean elite.

---

## 2. Colors & Surface Philosophy

The palette is anchored in the shadows of `background: #10141a`, punctuated by the sharp, metallic glint of `primary: #ffc637`.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition needed. If you feel a "need" for a line, use a margin instead.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of obsidian and smoked glass.
- **Base Layer:** `surface` (#10141a)
- **Secondary Cavity:** `surface-container-low` (#181c22) for background structural blocks.
- **Active Interactive Layer:** `surface-container-high` (#262a31) for cards that need to "pop."
- **Nesting:** Always place a higher-tier container inside a lower-tier one to create natural focus (e.g., a `surface-container-highest` search bar inside a `surface-container` header).

### The "Glass & Gold" Rule
For floating elements (modals, dropdowns), use **Glassmorphism**. Apply `surface-variant` at 60% opacity with a `20px` backdrop-blur. 
- **Signature Texture:** Use a linear gradient for primary CTAs transitioning from `primary` (#ffc637) to `primary-container` (#e2aa00) at a 135-degree angle. This mimics the luster of a physical gold bar.

---

## 3. Typography: The Bilingual Contrast

The typography strategy relies on the tension between the traditional weight of Korean Serifs and the technical precision of modern Sans-Serifs.

- **Display & Headlines (Noto Serif KR):** These are your "Editorial Statements." Use `display-lg` for high-impact screens. The serif evokes the history and "weight" of the *Master Ledger*.
- **Body & Titles (Pretendard / Manrope):** For functional data, use the clean, neutral Sans-Serif. This ensures readability in dark environments.
- **Thematic Korean Tone:**
    - **대도(大盜)의 비밀 장부** (The Master Ledger): Use `headline-lg` with `primary` color.
    - **작전 시작** (Initiate Briefing): Use `title-md` in `on-surface`.
    - **전리품 결산** (Extraction Complete): Use `display-sm` with a gold gradient.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering** rather than structural lines or heavy shadows.

- **The Layering Principle:** Depth is "stacked." Place `surface-container-lowest` (#0a0e14) elements within `surface` to create an "etched-in" look for input fields.
- **Ambient Shadows:** For floating "Stealth" elements, use a shadow with a blur of `40px`, spread of `-10px`, and an opacity of `8%` using a tinted `on-surface` color. It should feel like a soft glow, not a drop shadow.
- **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` (#4d4635) at **15% opacity**. Anything more is too loud for this system.

---

## 5. Components

### Buttons (The "Trigger")
- **Primary:** No border. Gradient fill (`primary` to `primary-container`). Text color: `on-primary` (#3f2e00). Roundedness: `sm` (0.125rem) for a sharp, tactical feel.
- **Secondary:** `surface-container-highest` fill with a `primary` text color. 
- **Tertiary:** Ghost style. No fill. `primary` text with an underline that only appears on hover.

### Cards & Lists
- **Rule:** Forbid divider lines. 
- **Implementation:** Separate list items using `spacing-3` (1rem) of vertical white space. If items must be grouped, use a subtle background shift to `surface-container-low`.
- **Interactions:** On hover, a card should transition from `surface-container` to `surface-container-high` with a `0.3s` ease-out.

### Inputs (The "Intel Fields")
- **Style:** Use `surface-container-lowest` as the fill to create an inset, "secure" appearance. 
- **Focus State:** No thick glow. Instead, change the `outline` color to `primary` at 40% opacity.

### Thematic Components: "The Ledger Item"
A specialized list item for *획득물 기록* (Secure Phase Results). It uses `notoSerif` for the value and `manrope` (label-sm) for the metadata, separated by a wide `spacing-8` gap to emphasize the "heist" data aspect.

---

## 6. Do's and Don'ts

### Do
- **Do** use `notoSerif` for all thematic Korean headers to maintain the "High-End" feel.
- **Do** use the `spacing-20` (7rem) value for hero section padding to create "Luxury Space."
- **Do** use `primary-fixed-dim` for disabled states of golden elements to keep them within the gold family without the "glow."

### Don't
- **Don't** use `round-full` for anything other than status indicators. High-stakes themes require the precision of `sm` and `md` corners.
- **Don't** use pure white (#FFFFFF). Always use `on-surface` (#dfe2eb) to prevent eye strain in dark mode.
- **Don't** use standard "success" green. Use `tertiary` (#f1c97d) for "positive" actions to keep the "Aureum" (Gold) palette consistent. Use `error` (#ffb4ab) only for critical mission failures.

---

## 7. Spacing & Rhythm

Use the **Progressive Scale**. 
- For internal component padding (buttons, chips), stick to `1` through `3`. 
- For layout-level breathing room, jump to `10`, `16`, or `24`. 
- **Intentional Asymmetry:** In the *작전 시작* (Briefing) screens, align text to the left at `10%` screen width, but place supporting imagery or data at `60%` width to create a non-linear, sophisticated ocular path.```