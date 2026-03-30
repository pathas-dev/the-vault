## 2024-05-18 - Vault Map Accessibility

**Learning:** Interactive floor plan maps with visually abstract selections (like walls, vaults, or entries) are challenging for screen readers when they rely purely on visual cues like glowing borders or color changes. Native HTML elements like `<button>` without aria states leave users guessing if they are pressed or selected.
**Action:** Always add `aria-pressed="true/false"` to abstract UI buttons that function as toggle states (vault selections, horizontal/vertical walls), and ensure `<input>` elements within dynamic structures have clear descriptive `aria-label`s connecting them to their context.
